'use strict';

const fairlightMedia = 'https://media.fairlightcycles.com/wp-content/uploads/';
const mondinceMedia = 'https://www.mondincecycle.com/uploads/';
const salsaMedia = 'https://www.salsacycles.com/cdn/shop/files/';
const bombtrackMedia = 'https://bombtrack.com/cdn/shop/files/';

const catalogPhotos = [
  ['Fairlight','Strael',fairlightMedia+'2025/01/Strael-4.0-56R-Stealth-DuraAce-1354x1016-Master.jpg','https://fairlightcycles.com/strael-4-0/',true],
  ['Fairlight','Faran',fairlightMedia+'2025/07/960-x-1280-Banner-Master-Faran-3.0-54T-Black-Custom-Build-scaled.jpg','https://fairlightcycles.com/faran-3-0/',true],
  ['Fairlight','Holt 2.0',fairlightMedia+'2026/06/FL-Product-Image-2560-x-2560-FS-Holt-2.0-Ochre-2048x2048.jpg','https://fairlightcycles.com/product/holt-2-0-frameset/'],
  ['Fairlight','Holt',fairlightMedia+'2024/08/FL-Gallery-1354-x-1016-Header-Holt-1.0-Desert-Hope-Custom.jpg','https://fairlightcycles.com/holt-1-0/',true],
  ['Fairlight','Secan',fairlightMedia+'2026/09/FL-Product-Image-Master-2560-x-2560-New-copy.jpg','https://fairlightcycles.com/product/secan-3-0-frameset/'],
  ['GRIND Cycles','GR1ST','https://grindcycles.com/cdn/shop/files/GRIND_GR1ST_CARBON_GRAVEL_FRAMESET_UDH_BSA_CUSTOM_PAINTED.jpg?v=1726330603&width=720','https://grindcycles.com/collections/bikes'],
  ['GRIND Cycles','TRACE','https://grindcycles.com/cdn/shop/files/GRIND_TRACE.jpg?v=1774116073&width=720','https://grindcycles.com/collections/gravel',true],
  ['GRIND Cycles','GRIT','https://grindcycles.com/cdn/shop/files/GRINDGRITPRODUCT.jpg?v=1768042063&width=533','https://grindcycles.com/products/grind-grit-allroad',true],
  ...[
    ['FM366','20260611/Premium-Carbon-Gravel-Frame.webp','china-new-released-max-57mm-tire-carbon-aero-gravel-bike-frame-fm366'],
    ['FM376','20261026/Mondince-FM376-Carbon-Racing-Gravel-Bike-Frame-57mm-Tire.webp','mondince-fm376-all-terrain-racing-carbon-gravel-bike-frame'],
    ['FM356','20261026/mondince-fm356-carbon-bikepacking-gravel-bike-frame.webp','fm356-61mm-max-tire-clearance-carbon-bikepacking-gravel-frame'],
    ['FM346','20260928/China-new-gravel-bike-frame.jpg','latest-design-57mm-max-tire-with-chainstay-and-downtube-protector-carbon-gravel-bike-frame--fm346'],
    ['FM336','20260515/Aero-Gravel-Bike-Frame-50mm-Tire.webp','2026-toray-t800-and-t1000-high-stiffness-storage-space-full-carbon-gravel-bike-frame-fm336'],
    ['FM326','20260515/Carbon-Aero-Gravel-Bike-Frame.webp','t47-bracket-420mm-fork-chinese-new-t1000-carbon-aero-design-gravel-bike-frame-fm326'],
    ['FM316','20261026/Mondince-FM316-AERO-Bracket-Gravel-Bike-Frame-Design-T47.webp','2026-aero-design-t47-bracket-gravel-bike-frame-fm316'],
    ['FM306','20261026/Mondince-FM306-Carbon-Gravel-Bike-Frame-Comfortable-Design.webp','new-design-flip-chip-offset--max-50mm-tire-t47-carbon-gravel-bike-frame-fm306'],
    ['FM296','20261026/Mondince-FM296-Full-Carbon-Fiber-Gravel-Bike-Frame-2025-New-Designed-UDH-Hanger.webp','2025-new-designed-udh-hanger-full-carbon-fiber-gravel-bike-frame-fm296'],
    ['FM286','20261026/Mondince-FM286-Carbon-Racing-Gravel-Bike-Frame.webp','carbon-racing-lightweight-t47-bracket-max-50mm-tire-china-gravel-bike-frame-fm286'],
    ['FM266','20261026/Mondince-FM266-T47-Bracket-Chinese-Gravel-Bike-Frame.webp','udh-hanger-fully-internal-cable-max-45mm-tire-carbon-fiber-gravel-bike-frameset-fm266'],
    ['FM166','20261026/Mondince-FM166-Max-42C-Tire-Carbon-Fiber-Cyclocross-Bike-Frameset.webp','27.2mm-seatpost-bsa-max-42mm-tire-carbon-fiber-cyclocross-bike-frameset-fm166']
  ].map(([model,image,slug]) => ['Mondince',model,mondinceMedia+image,'https://www.mondincecycle.com/product/'+slug]),
  ...[
    ['Beargrease','salsa-beargrease-carbon-frameset-2026-FM5424.png?v=1788208455','2026-beargrease-c-frameset'],
    ['Fargo 32 Ti','Fargo-32-ti-frame-FM4357.png?v=1784746104','fargo-32-ti-frameset'],
    ['Fargo 32 Steel','fargo-32-steel-frame-FM1907.png?v=1784746055','fargo-32-steel-frameset'],
    ['Spearfish C DLX','salsa-spearfish-dlx-frame-deep-orchid-carbon-FM2934.png?v=1775844988','2026-spearfish-c-dlx-frameset'],
    ['Blackthorn 145 C','salsa-blackthorn-c-145-frame-2026-FM6981.png?v=1775016404','2026-blackthorn-145-c-frameset'],
    ['Blackthorn 145','salsa-blackthorn-145-al-frame-black-spruce-FM0520.png?v=1774924848','2026-blackthorn-145-frameset'],
    ['Timberjack','salsa-timberjack-frame-deep-orchid-FM2814.png?v=1774465087','2026-timberjack-frame-deep-orchid'],
    ['Fargo Ti','salsa-fago-ti-frame-2026-FM3439.png?v=1772579506','2026-fargo-ti-frameset'],
    ['Journeyer','salsa-journeyer-2026-frameset-FM3445.png?v=1771882966','2026-journeyer-frameset'],
    ['Flyway C DLX','salsa-flyway-dlx-frameset-FM6938.png?v=1771392087','flyway-c-dlx-frameset'],
    ['Vaya','salsa_vaya_frame_black_FM1016.png?v=1750786221','2019-vaya-frameset'],
    ['Warroad','salsa-warroad-c-frameset-FM0924-2000x1316-uc-1.png?v=1739465068','2019_warroad_carbon_frameset'],
    ['Stormchaser','salsa-stormchaser-frameset-metallic-black-FM4616-1920x1080-uc-1.png?v=1739461716','2024-stormchaser-frameset'],
    ['Heyday! C','salsa-heyday-c-frameset-black-FM1477-1920x1080-uc-1.png?v=1739467196','2024-heyday-c-frameset']
  ].map(([model,image,slug]) => ['Salsa',model,salsaMedia+image+'&width=720','https://www.salsacycles.com/products/'+slug]),
  ...[
    ['Arise','BT_MY24_Arise_frameset_metallic_black_websquare_1_efe27436-68a9-4e7b-ada5-d2b54675e3d5_460x.jpg?v=1781861370','arise-frameset'],
    ['Audax AL','BT_MY24_Audax_AL_frameset_matt_black_websquare_1_a35726fc-aa52-4472-ba8f-1cc7e4e959b7_460x.jpg?v=1782739432','audax-al-frameset'],
    ['Audax','Bombtrack_Audax_metallic_darkbrown__websquare_1_720x.jpg?v=1781861613','audax-frameset'],
    ['Beyond AL','BT_MY26_Beyond_AL_frameset_metallic_black_websquare-1_b8550ae8-b072-4152-b5fa-30d3e3328fe5_720x.jpg?v=1782740304','beyond-al-frameset'],
    ['Beyond','BT_MY24_Beyond_frameset_metallic_black_websquare_1_7b17899f-b943-4b58-8fcb-8a841b77c680_720x.jpg?v=1782739629','beyond-frameset'],
    ['Beyond+','BT_MY26__Beyond__29_frameset_matt_sage_websquare-1_134a436d-bc92-424b-9a83-99b376ea38a4_720x.jpg?v=1781867504','beyond-plus-frame'],
    ['Hook AL','BT_Hook_AL_metallic_mahogany_4055822549615_websquare_1_a1808a47-5b86-4503-b095-ee2f8917f609_720x.jpg?v=1782740239','hook-al-frameset'],
    ['Hook EXT C','BT_MY24_Hook_EXT_C_frameset_metallic_black_websquare_1_d3732872-8e15-48f9-8aed-85836af559b6_720x.jpg?v=1781865496','hook-ext-c-frameset'],
    ['Hook EXT','BT_MY24_HookEXT_frameset_matt_black_websquare_1_04ad7771-d046-4ec9-b58a-6f97c3f57552_720x.jpg?v=1782740365','hook-ext-frameset'],
    ['Hook EXT Ti','BT_MY24_Hook_EXT_TI_frameset_titanium_black_websquare_1_b985f63e-3023-412c-a9e1-df2d7f134aad_720x.jpg?v=1782740435','hook-ext-ti-frameset'],
    ['Hook','BT_MY24_Hook_frameset_metallic_black_websquare_1_555944d9-ffc9-4250-8bff-3de3e8e284a6_720x.jpg?v=1781866036','hook-frameset']
  ].map(([model,image,slug]) => ['Bombtrack',model,bombtrackMedia+image,'https://bombtrack.com/products/bombtrack-'+slug])
].map(([brand,model,image,spec,built]) => ({id:brand+'/'+model,image,spec,credit:brand,built}));
