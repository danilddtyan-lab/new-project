"""Local Veloburo server and pre-publication data validation."""

import argparse
import json
import re
from datetime import date
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit


ROOT = Path(__file__).resolve().parent
CATEGORIES = {"гонки", "гонщики", "снаряжение", "маршруты", "события", "новинки", "запчасти"}
REGIONS = {"Кыргызстан", "международные"}
NEWS_FIELDS = {"id", "date", "title", "summary", "category", "region", "url", "source_name", "verified"}
STATIC_EXTENSIONS = {".html", ".css", ".js", ".json", ".jpg", ".jpeg", ".webp", ".png", ".svg", ".ico", ".mp4"}


def load_json(name):
    return json.loads((ROOT / "data" / name).read_text(encoding="utf-8"))


def order_news(item):
    priority = 2 if item["category"] == "запчасти" else int(item["region"] != "Кыргызстан")
    return priority, -date.fromisoformat(item["date"]).toordinal()


def query_news(items, query):
    category = query.get("category", [""])[0]
    region = query.get("region", [""])[0]
    title = query.get("q", [""])[0].strip().casefold()
    offset = int(query.get("offset", ["0"])[0])
    limit = int(query.get("limit", ["12"])[0])
    if offset < 0 or not 1 <= limit <= 100:
        raise ValueError("offset must be nonnegative and limit must be between 1 and 100")
    if category and category not in CATEGORIES or region and region not in REGIONS:
        raise ValueError("unknown category or region")
    matches = [
        item for item in sorted(items, key=order_news)
        if (not category or item["category"] == category)
        and (not region or item["region"] == region)
        and title in item["title"].casefold()
    ]
    return {"items": matches[offset:offset + limit], "total": len(matches), "offset": offset, "limit": limit}


def validate_data():
    items = load_json("news.json")
    if not isinstance(items, list):
        raise ValueError("news.json must contain a list")
    ids = set()
    for index, item in enumerate(items, 1):
        if not isinstance(item, dict) or not NEWS_FIELDS <= item.keys():
            raise ValueError(f"news record {index}: missing fields")
        if not isinstance(item["id"], str) or not re.fullmatch(r"[a-z0-9-]+", item["id"]) or item["id"] in ids:
            raise ValueError(f"news record {index}: invalid or duplicate id")
        ids.add(item["id"])
        timestamp = date.fromisoformat(item["date"])
        if timestamp.isoformat() != item["date"]:
            raise ValueError(f"{item['id']}: use YYYY-MM-DD")
        if item["category"] not in CATEGORIES or item["region"] not in REGIONS:
            raise ValueError(f"{item['id']}: invalid category or region")
        if not all(isinstance(item[field], str) and item[field].strip() for field in ("title", "summary", "source_name")):
            raise ValueError(f"{item['id']}: empty headline, summary or source")
        if not isinstance(item["verified"], bool):
            raise ValueError(f"{item['id']}: verified must be a boolean")
        if item["url"] is not None:
            parsed = urlsplit(item["url"])
            if parsed.scheme != "https" or not parsed.netloc:
                raise ValueError(f"{item['id']}: expected an HTTPS source")
        elif item["verified"] and item["source_name"] != "проверено владельцем сайта":
            raise ValueError(f"{item['id']}: verified records without a URL require the owner credit")
    if items != sorted(items, key=order_news):
        raise ValueError("news.json does not follow editorial order")
    if not load_json("builds.json")["builds"] or not load_json("routes.json"):
        raise ValueError("homepage configurations are empty")
    for records in load_json("product-media.json").values():
        for photo in records:
            if not photo["verified"]:
                continue
            image = (ROOT / photo["image_url"]).resolve()
            if not image.is_relative_to(ROOT / "data" / "images") or not image.is_file():
                raise ValueError(f"missing local image: {image.name}")
            if image.stat().st_size > 300_000:
                raise ValueError(f"image exceeds 300 KB: {image.name}")
    return {"news": len(items), "verified": sum(item["verified"] for item in items)}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_json(self, status, data):
        payload = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        if self.command == "GET":
            self.wfile.write(payload)

    def do_GET(self):
        self.serve()

    def do_HEAD(self):
        self.serve()

    def serve(self):
        parts = urlsplit(self.path)
        if parts.path == "/api/health":
            self.send_json(HTTPStatus.OK, {"status": "ok"})
            return
        if parts.path == "/api/news":
            try:
                items = load_json("news.json")
            except (OSError, ValueError):
                self.send_json(HTTPStatus.SERVICE_UNAVAILABLE, {"error": "news unavailable"})
                return
            try:
                result = query_news(items, parse_qs(parts.query, max_num_fields=10))
            except ValueError as error:
                self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
                return
            self.send_json(HTTPStatus.OK, result)
            return

        segments = Path(unquote(parts.path)).parts
        path = Path(self.translate_path(parts.path)).resolve()
        if path.is_dir():
            path = path / "index.html"
        if (any(segment.startswith(".") for segment in segments)
                or not path.is_relative_to(ROOT) or path.suffix not in STATIC_EXTENSIONS or not path.is_file()):
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        if self.command == "HEAD":
            super().do_HEAD()
        else:
            super().do_GET()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="validate site data and exit")
    parser.add_argument("--port", type=int, default=8000)
    options = parser.parse_args()
    if options.check:
        try:
            print(json.dumps(validate_data(), ensure_ascii=False))
        except (OSError, TypeError, ValueError, KeyError) as error:
            parser.exit(1, f"Data check failed: {error}\n")
    else:
        with ThreadingHTTPServer(("127.0.0.1", options.port), Handler) as server:
            print(f"http://127.0.0.1:{server.server_port}/", flush=True)
            server.serve_forever()
