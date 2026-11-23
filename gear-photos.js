'use strict';

const maxxisMedia = 'https://www.maxxis.com/us/wp-content/uploads/sites/13/2021/01/';
const gearPhotos = {
  'DT Swiss/GR 1600 SPLINE':'https://d2a13k6araex7u.cloudfront.net/itc/00/00/00/00/00/00/00/00/70/00/23/40/6/42447/image-thumb__42447__model-finder_product-image/PHO_WGR1600NID9S023395_WEB_SHO_001.0f56bf04.jpg',
  'DT Swiss/XM 1700 SPLINE':'https://d2a13k6araex7u.cloudfront.net/itc/00/00/00/00/00/00/00/00/70/00/27/95/1/68576/image-thumb__68576__model-finder_product-image/PHO_WXM1700TED2SA27946_WEB_SHO_001.6844c20f.jpg',
  'microSHIFT/Sword':'https://www.microshift.com/wp-content/uploads/2023/07/SWORD-Release-5-683x1024.jpg',
  'Topeak/FrontLoader 8 л':'https://www.topeak.com/storage/app/media/product/bikepacking/frontloader-2019/TBP-FL2B_main_2020-03%20(1).png',
  'Topeak/BarLoader':'https://www.topeak.com/storage/app/media/product/bikepacking/barloader/TBP-BRL1B_main.png',
  'Schwalbe/G-One RX Pro':'https://s3-fsn.scale.sc/schwalbe.public/prod-sde/media/d7/70/5d/1790245182/hs637_schwalbe_g-one_rx_pro_transparent_totale.png_01a0d2ed82507209a62c14340e053413.png?ts=1790245184',
  'Teravail/Rutland':'https://www.teravail.com/cdn/shop/files/teravail-rutland-tire-3qtr-blk-TR2700-2000px-sq.jpg?v=1747160917&width=640',
  'Apidura/Backcountry Frame Pack':'https://medias.apidura.com/sHRQ6jzh/2025/09/apidura-backcountry-frame-pack-2l-on-bike-1.jpg',
  'Apidura/Expedition Frame Pack':'https://medias.apidura.com/sHRQ6jzh/2026/02/apidura-expedition-frame-pack-4.3l-on-bike-1.jpg',
  'Apidura/Expedition Saddle Pack':'https://medias.apidura.com/sHRQ6jzh/2026/02/apidura-expedition-saddle-pack-13l-on-bike-2.jpg',
  'Cedaero/Hot-to-Go Beargrease':'https://cedaero.com/cdn/shop/files/IMG_0157.jpg?v=1794949135&width=640',
  'Maxxis/Aspen':'https://www.maxxis.com/int/wp-content/uploads/sites/17/2021/01/aspen.jpg',
  'Maxxis/Aspen ST':'https://shop.maxxis.com/cdn/shop/files/AspenST-tread.jpg?v=1756908325&width=640',
  'Maxxis/Rambler':maxxisMedia+'RAMBLER_Camera_1.jpg',
  'Maxxis/Rekon':maxxisMedia+'REKON_Camera_1.jpg',
  'Maxxis/Rekon Race':maxxisMedia+'REKON_Race_Camera_1.jpg',
  'Maxxis/Minion DHF':maxxisMedia+'MinionDHF_Camera_1.jpg',
  'Schwalbe/G-One Allround':'https://s3-fsn.scale.sc/schwalbe.public/prod-sde/media/89/e7/62/1790245464/hs473_schwalbe_g-one-allround_57-622_reflex_standard.png_01a043321d1871649de277dc800a74c6.png?ts=1790245466',
  'WTB/Resolute TCS':'https://www.wtb.com/cdn/shop/products/20200326_Resolute42_700_TCSLFR_tanwall_ISO.png?v=1742939652&width=640',
  'WTB/Raddler':'https://www.wtb.com/cdn/shop/files/20200512_Raddler40_TCSLFR_tanwall_ISO.jpg?v=1762163881&width=640',
  'WTB/Macro 54':'https://www.wtb.com/cdn/shop/files/W010-1134_Macro54x700_TCSLFR120tpiDualDNASG2tan_ISO.png?v=1787913143&width=640'
};
