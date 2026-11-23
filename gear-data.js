'use strict';

const gearSections = [
  {
    id:'bags',title:'Сумки',caption:'Рамные, подседельные и рулевые сумки для поездок с багажом.',
    items:[
      ['Rhinowalk','Plateau X 1,7 л','В раму','Компактная треугольная сумка. Сверьте положение фляг и места для ремней.','https://rhinowalk.com/products/plateau-series-x-waterproof-triangle-bag-1-7l'],
      ['Rhinowalk','Wilderness 14 л','Под седло','Сумка с крепёжной системой. Проверьте высоту седла и зазор над покрышкой.','https://rhinowalk.com/products/14l-waterproof-harness-saddle-bag-wilderness-series'],
      ['Apidura','Backcountry Frame Pack','В раму','Серия для MTB и бездорожья. Используйте шаблон производителя для проверки посадки.','https://www.apidura.com/shop/backcountry-frame-pack/'],
      ['Sarmatian Bags','Рамная сумка','В раму','Примеры работ и варианты крепления у мастерской. Размеры и материал уточняйте для конкретной сумки.','https://www.instagram.com/sarmatianbags/'],
      ['Revelate Designs','Tangle','В раму','Полурамная сумка из X-Pac VX21. Подберите длину и проверьте доступ к флягам.','https://revelatedesigns.com/product/tangleframebag/'],
      ['Apidura','Expedition Frame Pack','В раму','Для инструментов, еды и тяжёлых вещей по центру велосипеда.','https://www.apidura.com/shop/expedition-frame-pack/'],
      ['Apidura','Expedition Saddle Pack','Под седло','Для объёмных лёгких вещей. Проверьте зазор над задним колесом.','https://www.apidura.com/shop/expedition-saddle-pack/'],
      ['Restrap','Race Frame Bag','В раму','Узкая сумка. Сверьте длину, высоту и расположение ремней.','https://restrap.com/'],
      ['Ortlieb','Handlebar-Pack','На руль','Рулевой рулон. Проверьте ширину между ручками и зазор до покрышки.','https://www.ortlieb.com/'],
      ['Tailfin','AeroPack','На багажник','Консольная система. Проверьте подходящее крепление к оси или раме.','https://www.tailfin.cc/']
    ]
  },
  {
    id:'wheels',title:'Колёса',caption:'Вилсеты и обода для гравия и MTB.',
    items:[
      ['DT Swiss','GR 1600 SPLINE','Гравий','Алюминиевый вилсет. Подберите диаметр, барабан и стандарт ротора.','https://www.dtswiss.com/'],
      ['HUNT','4 Season Gravel X-Wide','Гравий','Алюминиевый вилсет. Сверьте внутреннюю ширину обода с покрышкой.','https://www.huntbikewheels.com/'],
      ['Shimano','GRX WH-RX570','Гравий','Проверьте диаметр, оси и совместимость кассеты с барабаном.','https://bike.shimano.com/'],
      ['DT Swiss','XM 1700 SPLINE','MTB','Проверьте стандарт втулок и допустимый системный вес.','https://www.dtswiss.com/'],
      ['Race Face','Aeffect R','MTB','Проверьте ширину осей и стандарт барабана для вашей кассеты.','https://www.raceface.com/'],
      ['WTB','KOM Tough i30','Обод','Обод для сборки колеса. Подберите число спиц, втулку и диаметр.','https://www.wtb.com/']
    ]
  },
  {
    id:'tires',title:'Покрышки',caption:'Покрышки для асфальта, гравия, троп и рыхлого покрытия.',
    items:[
      ['Maxxis','Aspen','XC / плотный грунт','Быстрая XC-покрышка. Проверьте размер, версию и зазор в раме и вилке.','https://www.maxxis.com/int/tire/aspen/'],
      ['Schwalbe','Marathon Almotion','Асфальт','Дорожная туристическая покрышка. Сверьте точный размер ETRTO.','https://www.schwalbe.com/en/Marathon-Almotion'],
      ['Schwalbe','G-One Bite','Гравий','Протектор для смешанных дорог. Проверьте выбранную ширину и тип борта.','https://www.schwalbe.com/en/bike-tires/'],
      ['Continental','Terra Trail','Гравий','Более выраженный протектор для рыхлого грунта.','https://www.continental-tires.com/products/b2c/bicycle/tires/terra-trail/'],
      ['Maxxis','Ikon','XC / смешанный грунт','Универсальная XC-покрышка. Диаметр и состав зависят от версии.','https://www.maxxis.com/'],
      ["Maxxis", "Rambler", "Гравий", "Мелкий протектор для плотного гравия и смешанных дорог. Версии EXO и SilkShield различаются каркасом.", "https://www.maxxis.com/us/tire/rambler/"],
      ["Maxxis", "Rekon Race", "XC / плотный грунт", "Низкий протектор для сухих трасс XC. Уточните каркас и размер у производителя.", "https://www.maxxis.com/us/tire/rekon-race/"],
      ["Maxxis", "Rekon", "Трейлы", "Покрышка для лёгких трейлов и переменного грунта. Сверьте ширину обода.", "https://www.maxxis.com/us/tire/rekon/"],
      ["Schwalbe", "G-One Allround", "Гравий", "Низкие округлые шашки для асфальта и лёгкого гравия.", "https://www.schwalbe.com/en/G-One-Allround-11654645"],
      ["Schwalbe", "G-One RS", "Гравий", "Полуслик для быстрого хода по твёрдому покрытию.", "https://www.schwalbe.com/en/schwalbe-gravel-tires"],
      ["Schwalbe", "G-One R", "Гравий", "Универсальный гоночный протектор для переменного покрытия.", "https://www.schwalbe.com/en/schwalbe-gravel-tires"],
      ["Schwalbe", "G-One RX", "Гравий", "Выраженный рисунок для рыхлого и мокрого грунта.", "https://www.schwalbe.com/en/schwalbe-gravel-tires"],
      ["Schwalbe", "G-One Overland", "Гравий", "Модель для длинных поездок по асфальту и грунту.", "https://www.schwalbe.com/en/blog/news/product-features/g-one-overland/"],
      ['Schwalbe','Jumbo Jim','Песок / снег','Фэтбайковая покрышка. Нужны соответствующие рама, вилка и обода.','https://www.schwalbe.com/en/bike-tires/']
    ]
  },
  {
    id:'drivetrains',title:'Трансмиссии',caption:'Механические и электронные системы для гравия и MTB.',
    items:[
      ['SENTYEH','ECS PRO','Электронная трансмиссия','Беспроводное переключение. Для комплекта сверяйте манетки, переключатель, кассету, цепь и тормоза.','https://sentyehsmart.com/'],
      ['Shimano','GRX RX820','Гравий','Механические конфигурации 1×12 и 2×12. Уточните барабан под выбранную кассету.','https://bike.shimano.com/en-UK/stories/article/shimano-grx-personalities.html'],
      ['Shimano','GRX RX400','Гравий','Механическая платформа 2×10. Сверьте совместимость манеток и переключателей.','https://bike.shimano.com/'],
      ['Shimano','Deore M6100','MTB','1×12 с плоским рулём. Кассете CS-M6100 нужен Micro Spline.','https://bike.shimano.com/'],
      ['SRAM','Apex XPLR','Гравий','Семейство 1×12. Уточните механическое или электронное исполнение и кассету.','https://www.sram.com/'],
      ['microSHIFT','Sword','Гравий','Механическое семейство 10 скоростей для руля-барана. Сверьте версию 1× или 2×.','https://www.microshift.com/'],
      ['microSHIFT','Advent X','MTB / гравий','1×10. Выберите манетку для своего руля из совместимой линейки.','https://www.microshift.com/']
    ]
  }
];

const freeTourBags = [
  [
    "Rhinowalk",
    "Вилочная сумка",
    "На вилку",
    "Для одежды, инструментов и другой экипировки, которую удобнее разместить сбоку от колеса. Сверьте крепление с вашей вилкой.",
    "https://freetour-sigma.vercel.app/rhinowalkfork.html",
    "https://freetour-sigma.vercel.app/05_c33d7afc-b279-483c-8d2c-bdd36ae4d002.webp"
  ],
  [
    "Rhinowalk",
    "Нарульная сумка",
    "На руль",
    "Два заявленных объёма, 4 и 8 л. Меньший удобен для коротких выездов, больший вмещает лёгкую экипировку для дальнего маршрута.",
    "https://freetour-sigma.vercel.app/rhinowalkbar.html",
    "https://freetour-sigma.vercel.app/71IhgfzfY-S.jpg"
  ],
  [
    "Apidura",
    "Expedition Fork Pack",
    "На вилку",
    "Сумка для вилочной платформы cargo cage. Перед заказом уточните, входит ли сама платформа в комплект.",
    "https://freetour-sigma.vercel.app/apidurafork.html",
    "https://freetour-sigma.vercel.app/apidura-apidura-expedition-fork-pack-3l.jpg"
  ],
  [
    "Apidura",
    "Expedition Saddle Pack",
    "Под седло",
    "Водонепроницаемая подседельная сумка. Крепится без багажника. Проверьте свободное место между седлом и покрышкой.",
    "https://freetour-sigma.vercel.app/apidurasaddle.html",
    "https://freetour-sigma.vercel.app/tb_image_share_1770908212687.png"
  ]
];
