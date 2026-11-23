'use strict';
const brands = [
['Surly','https://surlybikes.com/','Ogre|S|E,Bridge Club|S|E,Disc Trucker|S|E,Midnight Special|S|G,Straggler|S|G,Grappler|S|E,Karate Monkey|S|M,Krampus|S|M,Preamble|S|G,Wednesday|S|F,Ice Cream Truck|S|F'],
['Salsa','https://www.salsacycles.com/','Fargo|S|E,Fargo Ti|T|E,Cutthroat|C|E,Journeyer|A|G,Warbird|C|G,Warroad|C|G,Timberjack|A|M,Timberjack Ti|T|M,Mukluk|A|F,Beargrease|C|F'],
['Bombtrack','https://www.bombtrack.com/','Beyond|S|E,Beyond+|S|M,Beyond+ ADV|S|E,Hook|S|G,Hook EXT|S|G,Hook EXT C|C|G,Arise|S|G,Audax|S|G'],
['Brother Cycles','https://www.brothercycles.com/','Big Bro|S|M,Mehteh|S|G,Kepler|S|G,Mr Wooden|S|E,Stroma|S|G'],
['Fairlight','https://fairlightcycles.com/','Secan|S|G,Faran|S|E,Holt|S|M'],
['Curve','https://www.curvecycling.com/','Kevin of Steel|S|G,GXR (Kevin)|T|G,GMX+|T|E,Big Kev|T|E,UPROCK|T|M'],
['Kona','https://www.konaworld.com/','Sutra|S|E,Sutra LTD|S|E,Unit|S|M,Unit X|S|M,Rove|S|G,Rove LTD|S|G,Libre CR|C|G,Honzo ESD|S|M'],
['Ritchey','https://ritcheylogic.com/','Outback|S|G,Outback Break-Away|S|G,Ascent|S|E,Swiss Cross|S|G,Ultra|S|M,P-29er|S|M'],
['Wilde','https://www.wildebikes.com/','Supertramp|S|E,Rambler|S|G,Rambler SL|S|G,Dream Engine|T|G,Earth Ship Steel|S|G,Earth Ship Titanium|T|G,Wayfinder|S|M'],
['Otso','https://otsocycles.com/','Fenrir Stainless|S|E,Fenrir Titanium|T|E,Waheela C|C|G,Warakin Stainless|S|G,Warakin Titanium|T|G,Voytek|C|F,Arctodus|S|F'],
['Esker','https://eskercycles.com/','Hayduke|S|M,Hayduke Ti|T|M,Japhy|S|M,Lorana|T|M'],
['All-City','https://allcitycycles.com/','Gorilla Monsoon|S|G,Space Horse|S|G,Cosmic Stallion|S|G,Cosmic Stallion Ti|T|G,Nature Cross|S|G,Electric Queen|S|M'],
['Marin','https://www.marinbikes.com/','Pine Mountain|S|M,Four Corners|S|E,Nicasio|S|G,Headlands|C|G,Gestalt X|A|G'],
['Trek','https://www.trekbikes.com/','Checkpoint SL|C|G,Checkpoint ALR|A|G,1120|A|E,920|A|E,Farley|A|F'],
['Rodeo Labs','https://www.rodeo-labs.com/','Flaanimal 5.0|S|G,Flaanimal Ti|T|G,Trail Donkey|C|G'],
['Specialized','https://www.specialized.com/','Diverge STR|C|G,Diverge Carbon|C|G,Crux|C|G,Chisel Hardtail|A|M'],
['Cannondale','https://www.cannondale.com/','Topstone Carbon|C|G,Topstone Alloy|A|G'],
['Cervélo','https://www.cervelo.com/','Áspero|C|G,Áspero-5|C|G'],
['OPEN','https://opencycle.com/','U.P.|C|G,UPPER|C|G,WI.DE.|C|G'],
['ENVE','https://enve.com/','MOG|C|G'],
['Niner','https://www.ninerbikes.com/','RLT 9|A|G,RLT 9 Steel|S|G,RLT 9 RDO|C|G'],
['Hudski','https://hudskibikes.com/','Doggler|A|E'],
['Velo Orange','https://velo-orange.com/','Pass Hunter|S|G,Polyvalent|S|E,Piolet|S|E,Neutrino|S|E'],
['Tumbleweed','https://tumbleweed.cc/','Prospector|S|E,Stargazer|S|E,Sunliner|S|E'],
['Singular','https://singularcycles.com/','Gryphon|S|E,Peregrine|S|G,Swift|S|M'],
['Genesis','https://www.genesisbikes.co.uk/','Tour de Fer|S|E,Croix de Fer|S|G,Fugio|S|G'],
['Nordest','https://nordestcycles.com/','Albarda|S|G,Sardinha|S|E,Super Albarda|T|G,Bardino|S|M'],
['Soma','https://www.somafab.com/','Wolverine|S|G,Grand Randonneur|S|E,Jawbone|S|E,Double Cross|S|G'],
['Kinesis UK','https://www.kinesisbikes.co.uk/','Tripster ATR|T|G,Tripster AT|A|G,G2|A|G'],
['3T','https://www.3t.bike/','Exploro RaceMax|C|G,Exploro Ultra|C|G,Extrema Italia|C|G'],
['Mason','https://masoncycles.cc/','Bokeh|A|G,Bokeh Ti|T|G,Exposure|S|G,ISO|S|E,Raw|S|M'],
['Tout Terrain','https://tout-terrain.de/','Outback|S|E,Scrambler|S|G,Silkroad|S|E,Blueridge|S|E'],
['Pelago','https://pelagobicycles.com/','Stavanger|S|G,Sibbo|A|G'],
['Vitus','https://vitusbikes.com/','Substance CRS|C|G,Substance VRS|A|G,Sentier|A|M'],
['Giant','https://www.giant-bicycles.com/','Revolt Advanced|C|G,Revolt|A|G,XTC Advanced|C|M'],
['Santa Cruz','https://www.santacruzbicycles.com/','Stigmata|C|G,Chameleon|A|M,Highball|C|M'],
['Bearclaw','https://bearclawbicycleco.com/','Thunderhawk|T|G,Beaux Jaxon|T|E,Towmak|T|F'],
['Chumba','https://chumbausa.com/','Terlingua Steel|S|G,Terlingua Titanium|T|G,Sendero Steel|S|M,Sendero Titanium|T|M'],
['Stooge','https://stoogecycles.co.uk/','Scrambler|S|M,Speedbomb|S|M,Dirt Tracker|S|M'],
['State Bicycle Co.','https://www.statebicycle.com/','4130 All-Road|S|G,6061 All-Road|A|G,Carbon All-Road|C|G']
];
const material = {S:'Сталь',T:'Титан',A:'Алюминий',C:'Карбон'};
const terrain = {G:'Гравий',E:'Туринг',M:'Трейлы / MTB',F:'Фэтбайк'};
const frames = brands.flatMap(([brand,url,models]) => models.split(',').map(entry => {
  const [model,m,t] = entry.replace(/\u200b/g,'').split('|');
  return {brand,url,model,m,t,id:brand+'/'+model};
}));
