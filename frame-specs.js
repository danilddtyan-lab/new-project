'use strict';

const frameSpecs = {
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
    clearanceMm:50, source:'https://carbonda.com/road/cfr-707.html'
  },
  'SPCycle/G026': {
    clearanceMm:50,
    source:'https://www.sp-cycle.com/Spcycle-G026-Carbon-Gravel-Bike-Frame-700x50C-UDH-Thread-T47-865-Storage-Box-Gravel-Bicycle-Carbon-Frameset-p7023451.html'
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
