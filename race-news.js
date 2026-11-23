'use strict';

const raceNews = [
  {
    id:'kollegin-seven-rivers', category:'riders', date:'2026-11-23', dateLabel:'23 ноября 2026',
    title:'Антон Коллегин примет участие в Seven Rivers Ultra',
    summary:'По информации Велобюро, Антон Коллегин планирует стартовать на Seven Rivers Ultra в Казахстане. Старт запланирован на 26 июня 2027 года в Алматы. Маршрут длиной около 1075 км финиширует в Конаеве.',
    source:'https://sevenriversultra.com/', sourceLabel:'Маршрут и даты у организатора'
  },
  {
    category:'upcoming', date:'2027-06-26', dateLabel:'26 июня 2027 · старт',
    title:'Seven Rivers Ultra стартует в Алматы',
    summary:'Организаторы заявили около 1075 км и более 14 000 м набора. Маршрут пройдёт через плато Асы и Алтын-Эмель, с финишем в Конаеве.',
    source:'https://sevenriversultra.com/', sourceLabel:'Сайт организатора'
  },
  {
    date:'2026-08-22', dateLabel:'22–23 августа 2026',
    title:'Шоссейный чемпионат Кыргызстана в Балыкчы',
    summary:'Федерация опубликовала результаты чемпионата. В программе были дистанции 15, 25, 39 и 53 км.',
    source:'https://velosport.kg/results', sourceLabel:'Протоколы ФВКР'
  },
  {
    date:'2026-08-09', dateLabel:'9 августа 2026',
    title:'Apricot Race в Новопокровке',
    summary:'Гравийный и MTB-марафон прошёл на дистанциях 40 и 100 км. Результаты доступны у Федерации велоспорта Кыргызстана.',
    source:'https://velosport.kg/results', sourceLabel:'Протоколы ФВКР'
  },
  {
    date:'2026-05-24', dateLabel:'24 мая 2026',
    title:'Чемпионат Кыргызстана по MTB в Орто-Сае',
    summary:'Федерация собрала результаты майской гонки в предгорьях Бишкека.',
    source:'https://velosport.kg/results', sourceLabel:'Протоколы ФВКР'
  },
  {
    date:'2024-09-05', dateLabel:'5 сентября 2024 · архив',
    title:'Карточка контрольных пунктов из архива HaiDOS',
    summary:'На фото сохранились отметки Сон-Куля, Кель-Суу и Тамги, а также финиша в Чолпон-Ате.',
    source:'https://www.instagram.com/haid0s/p/C_iWW5vst06/', sourceLabel:'Публикация в Instagram'
  },
  {"date": "2026-12-12", "dateLabel": "12 декабря 2026", "title": "Чемпионат Кыргызстана по e-cycling", "summary": "Федерация анонсировала онлайн-старт на MyWhoosh. В программе Tour de Corse: три круга, 46,5 км.", "source": "https://velosport.kg/en/calendar/15-chempionat-kyrgyzstana-po-e-cycling-na-platforme-mywhoosh.html", "sourceLabel": "Регламент и регистрация", "category": "upcoming"},
  {"date": "2026-10-19", "dateLabel": "19 октября 2026", "title": "Две кыргызские команды в сезоне 2027", "summary": "По данным федерации, Bishkek Cycling Team продлила континентальную регистрацию UCI. Lokomotiv–Manas продолжит сезон в статусе велоклуба.", "source": "https://velosport.kg/news/88-professionalnye-velokomandy-kyrgyzstana-v-sezone-2027-goda.html", "sourceLabel": "Сообщение ФВКР", "category": "riders"},
  {"date": "2026-09-12", "dateLabel": "12–13 сентября 2026", "title": "Kashka-Suu MTB Weekend", "summary": "В программе двухдневного старта в Чуйской области были даунхилл и кросс-кантри.", "source": "https://velosport.kg/en/calendar/13-kashka-suu-mtb-weekend-dhi-xc.html", "sourceLabel": "Архив организатора", "category": "archive"},
  {"date": "2026-08-03", "dateLabel": "3 августа 2026", "title": "Владимир Гончаров выиграл Memorial Fornasiero", "summary": "Гонщик Lokomotiv Manas победил на итальянской однодневке Elite/U23.", "source": "https://velosport.kg/news/77-vladimir-goncharov-vyigral-prestizhnyi-memorial-fornasiero-v-italii.html", "sourceLabel": "Сообщение ФВКР", "category": "riders"},
  {"date": "2026-07-26", "dateLabel": "26 июля 2026", "title": "Влас Шичкин победил в гонке по очкам", "summary": "Федерация сообщила о победе гонщика Lokomotiv Manas на соревнованиях в Италии.", "source": "https://velosport.kg/news/73-pobeda-lokomotiv-manas-v-italii.html", "sourceLabel": "Сообщение ФВКР", "category": "riders"},
  {"date": "2026-07-18", "dateLabel": "18 июля 2026", "title": "Артур Тютюнников получил старт в Корее", "summary": "Федерация объявила, что гонщик выступит за WCC Korea на национальном шоссейном чемпионате в Кимчхоне.", "source": "https://velosport.kg/news/72-artur-tyutyunnikov-vystupit-na-chempionate-respubliki-koreja-v-sostave-komandy-wcc-korea.html", "sourceLabel": "Сообщение ФВКР", "category": "riders"},
  {"date": "2026-06-18", "dateLabel": "18 июня 2026", "title": "Первый старт Кыргызстана в даунхилле на чемпионате Азии", "summary": "Перед чемпионатом в Ташкенте федерация объявила, что страну в дисциплине DHI представят три гонщика.", "source": "https://velosport.kg/news/70-kyrgyzstan-vpervye-vystupit-v-daunhille-na-chempionate-azii-po-mauntinbaiku.html", "sourceLabel": "Анонс ФВКР", "category": "riders"},
  {"date": "2026-04-11", "dateLabel": "11–12 апреля 2026", "title": "Grand Prix Issyk-Kul", "summary": "В архиве федерации сохранилась карточка весенней гонки с программой и регламентом.", "source": "https://velosport.kg/calendar/8-grand-prix-issyk-kul-2026.html", "sourceLabel": "Карточка гонки", "category": "archive"},
  {"date": "2026-03-22", "dateLabel": "22 марта 2026", "title": "Подиум Lokomotiv Manas на Grand Prix Slovenia Istria", "summary": "Федерация сообщила о втором месте команды на словенской однодневке категории UCI 1.2.", "source": "https://velosport.kg/news/68-serebrjanyi-uspeh-lokomotiv-manas-v-slovenii.html", "sourceLabel": "Сообщение ФВКР", "category": "riders"},
  {"date": "2026-03-07", "dateLabel": "7 марта 2026", "title": "Зимний шоссейный чемпионат среди юниоров", "summary": "На старте в Чолпон-Ате юниоры проехали 96 км. Результаты опубликованы в архиве федерации.", "source": "https://velosport.kg/results", "sourceLabel": "Протоколы ФВКР", "category": "archive"},
  {"date": "2025-08", "dateLabel": "Август 2025", "title": "Silk Road Mountain Race 2025", "summary": "Архив трекинга гонки по Кыргызстану с картой и материалами с дистанции.", "source": "https://bikepacking.com/tracker/2025-silk-road-mountain-race/", "sourceLabel": "Архив гонки", "category": "archive"},
  {"date": "2024-07-06", "dateLabel": "6 июля 2024", "title": "Итоги чемпионата Азии", "summary": "В зачёте Masters Александр Дядичкин стал вторым в групповой гонке, а Игорь Филин — третьим в разделке.", "source": "https://velosport.kg/news/6-itogi-chempionata-azii-2024.html", "sourceLabel": "Отчёт ФВКР", "category": "archive"},
  {
    date:'2025-07-05', dateLabel:'5–6 июля 2025', category:'archive',
    title:'Шоссейный чемпионат Кыргызстана 2025 в Балыкчы',
    summary:'Федерация подвела итоги разделки и групповой гонки. Это был первый полномасштабный чемпионат страны с 1992 года.',
    source:'https://velosport.kg/en/news/42-v-kyrgyzstane-proshyol-pervyi-s-1992-goda-polnomasshtabnyi-chempionat-strany-po-shosseinomu-velos.html',
    sourceLabel:'Итоги ФВКР'
  }
];
