'use strict';

const mondinceSpecs = [
  ['FM356',1100,61,'Для байкпакинга по рыхлому покрытию.'],
  ['FM376',1080,57,'Гоночная геометрия для смешанного покрытия.'],
  ['FM366',1050,57,'Аэропрофиль и отсек в нижней трубе.'],
  ['FM326',1100,50,'Вилка с регулировкой вылета flip-chip.'],
  ['FM316',1150,50,'Геометрия для длинных дистанций.'],
  ['FM306',1010,50,'Вилка со сменным вылетом.'],
  ['FM296',1150,50,'Отсек в нижней трубе для инструмента и мелочей.'],
  ['FM286',950,50,'Облегчённая рама для гонок и подъёмов.'],
  ['FM266',1150,45,'Платформа для смешанного покрытия с несколькими вариантами каретки.'],
  ['FM166',1020,42,'Рама для циклокросса с резьбовой кареткой BSA.']
];

const frameSpecs = {
  ...Object.fromEntries(mondinceSpecs.map(([model,weightG,clearanceMm,note]) => [
    'Mondince/'+model,{current:true, weightG, clearanceMm, note, weightBasis:'заявленный вес рамы',
      source:'https://www.mondincecycle.com/products/carbon-gravel-bike-frame'}
  ])),
  'Ribble/Ultra Grit': {clearanceMm:50,current:true,note:'Отсек в нижней трубе и петух UDH.',source:'https://www.ribblecycles.co.uk/ribble-ultra-grit/'},
  'Whyte/Verro': {current:true,note:'В заводской сборке стоят Maxxis Ravager 50 мм.',source:'https://whytebikes.com/products/verro-gravel-adventure-bike?variant=55457665778037'},
  'Kinesis UK/Tripster AT Plus': {current:true,clearanceMm:50,source:'https://kinesisbikes.co.uk/products/kinesis-tripster-at-plus'},
  'Cinelli/Tutto Mini': {current:true,source:'https://cinelli-milano.com/collections/tutto-mini'},
  'Argon 18/Anti Matter': {current:true,clearanceMm:52,clearanceNote:'До 55 мм фактической ширины по инструкции.',source:'https://storage.googleapis.com/argon18craft/files/Assembly-Guides/2026/ANTI-MATTER_Assembly-Guide_386A-B-C_2026-05-11.pdf'},
  'Specialized/Diverge 4': {current:true,source:'https://www.specialized.com/us/en/diverge'},
  'Santa Cruz/Stigmata': {current:true,clearanceMm:50,clearanceNote:'Stigmata 4 MY26: до 50 мм с 1×, до 45 мм с 2×.',source:'https://www.santacruzbicycles.com/pages/product-support/stigmata-4-my-26'},
  'Cinelli/Hobootleg Geo': {clearanceMm:76,note:'Производитель указывает максимальную ширину 29 × 3,0″.',source:'https://cinelli-milano.com/collections/test-outlet-bikes/products/hobootleg-geo-frameset'},
  'ENVE/MOG': {clearanceMm:50,current:true,source:'https://support.enve.com/hc/en-us/article_attachments/13112328880155'},
  'Canyon/Grizl CF': {clearanceMm:54,current:true,clearanceNote:'Поколение с допуском до 54 мм.',source:'https://www.canyon.com/en-us/gravel-bikes/adventure/grizl/'},
  'Trek/Checkpoint ALR Gen 3': {clearanceMm:50,current:true,source:'https://www.trekbikes.com/emea/en_EM_DS/bikes/bikepacking-and-touring-bikes/checkpoint/checkpoint-alr/f/F224-2/checkpoint-alr-5-gen-3/49946/5332810/'},
  'Moots/Routt 45': {clearanceMm:45,clearanceNote:'Архивная спецификация. Сверьте год рамы.',source:'https://moots.com/wp-content/uploads/2023/02/2018-WHATS-NEW.pdf'},
  'Moots/Routt RSL': {clearanceMm:50,current:true,source:'https://moots.com/products/routt-rsl'},
  'SPCycle/G028': {
    current:true, weightG:1100, toleranceG:60, weightBasis:'матовая чёрная рама',
    clearanceMm:57, kitUsd:738,
    sizes:[[160,170,'S'],[171,179,'M'],[180,187,'L'],[188,196,'XL']],
    source:'https://www.sp-cycle.com/Spcycle-G028-Carbon-Gravel-Bike-Frame-700x57C-UDH-Hanger-Full-Integrated-Cable-Gravel-Bicycle-Frameset-With-HB-068-Handlebar-p7012723.html'
  },
  'Tideace/FM-GV201': {
    current:true, weightG:1150, toleranceG:40, weightBasis:'размер 52',
    clearanceMm:50, kitUsd:799,
    source:'https://tideacebike.com/products/fm-gv201-noah-carbon-gravel-bike-frame'
  },
  'Twitter/G2 MAX': {
    clearanceMm:50, current:true,
    source:'https://twitterbikeusa.com/products/twitter-g2max-alloy-gravel-frame-set-al6061-t6-frame-carbon-fork-700c-thru-axle-udh-700-50c'
  },
  'Canyon/Grizl AL': {
    current:true, weightG:1760, weightBasis:'R124, размер M',
    clearanceMm:54, frontMm:54, rearMm:54,
    source:'https://www.canyon.com/en-gb/gravel-bikes/adventure/grizl/al/grizl-5/4443.html'
  },
  'VeloBuild/GF-003': {
    clearanceMm:45, kitUsd:479,
    source:'https://www.velobuild.com/products/gf-003-carbon-fiber-gravel-frameset'
  },
  'SPCycle/G056': {
    clearanceMm:47, kitUsd:528,
    source:'https://www.sp-cycle.com/2023-new-t1000-carbon-gravel-frame-70047c-cyclocross-bike-frame-t47-disc-brake-gravel-bike-frameset-road-bike-frame-p4468945.html'
  },
  'Carbonda/CFR707': {
    clearanceMm:50, weightG:1300, toleranceG:50, weightBasis:'размер M, с металлическими деталями',
    source:'https://carbonda.com/road/cfr-707.html'
  },
  'SPCycle/G026': {
    clearanceMm:50, weightG:1250, toleranceG:60,
    source:'https://www.sp-cycle.com/Spcycle-G026-Carbon-Gravel-Bike-Frame-700x50C-UDH-Thread-T47-865-Storage-Box-Gravel-Bicycle-Carbon-Frameset-p7023451.html'
  },
  'Carbonda/CFR696': {
    clearanceMm:50, weightG:1200, toleranceG:50,
    source:'https://carbonda.com/road/cfr-696.html'
  },
  'SPCycle/G068': {
    clearanceMm:47, weightG:1120, toleranceG:30, weightBasis:'размер M, матовая чёрная, без металлических деталей',
    source:'https://www.sp-cycle.com/spcycle-g068-t1000-carbon-gravel-bike-frame-semi-internal-cable-udh-hanger-disc-brake-aero-carbon-gravel-bicycle-frameset-p5700272.html'
  },
  'LightCarbon/LCG087-D': {
    clearanceMm:47, weightG:1480, toleranceG:40, weightBasis:'размер M',
    source:'https://www.lightcarbon.com/lightcarbon-gravel-frameset-with-micro-suspension-downtube-storage-plus-handlebar_p243.html'
  },
  'ICAN/Graro': {
    clearanceMm:45,
    source:'https://icancycling.com/products/graro-eu'
  },
  'Fairlight/Secan': {
    current:true, clearanceMm:53, frontMm:53, rearMm:53,
    clearanceNote:'Secan 3.0, 1× без крыльев. С 2× до 48 мм.',
    source:'https://fairlightcycles.com/secan-3-0/'
  },
  'Surly/Grappler': {
    current:false, clearanceMm:53, frontMm:56, rearMm:64,
    clearanceNote:'Зад: от 53 до 64 мм в зависимости от положения оси. Перед: без крыла.',
    source:'https://surlybikes.com/products/grappler'
  },
  'Salsa/Fargo': {
    current:true, kitUsd:1599, clearanceMm:66, frontMm:76, rearMm:76,
    clearanceNote:'Fargo Steel 2026. Заднее колесо в размере XS: до 66 мм.',
    source:'https://www.salsacycles.com/products/2026-fargo-steel-frameset'
  }
};
