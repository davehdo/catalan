'use strict';


const WHEAT = "WHEAT";
const SHEEP = "SHEEP";
const LUMBER = "LUMBER";
const BRICK = "BRICK";
const ORE = "ORE";
const DESERT = "DESERT";


let resourceColorMap = {}

resourceColorMap[DESERT] = "tan",
resourceColorMap[ORE] = "silver",
resourceColorMap[BRICK] = "firebrick",
resourceColorMap[LUMBER] = "forestgreen",
resourceColorMap[SHEEP] = "lightgreen",
resourceColorMap[WHEAT] = "gold"

// 14 Soldiers/Knights (I'll call them Knights from now on)
// 5 Victory Points.
// 2 Road Building Cards.
// 2 Monopoly Cards.
// 2 Year of Plenty Cards.

const DEV_KNIGHT = "DEV_KNIGHT";
const DEV_VP = "DEV_VP";
const DEV_ROAD = "DEV_ROAD";
const DEV_MONOPOLY = "DEV_MONOPOLY";
const DEV_PLENTY = "DEV_PLENTY";

let devCardDescriptions = {
	DEV_KNIGHT: "",
	DEV_VP: "",
	DEV_ROAD: "",
	DEV_MONOPOLY: "",
	DEV_PLENTY: "",
}


module.exports = {
	maxSettlements: 5, // Each player has a supply of 15 roads, 5 settlements, and 4 cities.
	maxCities: 4,
	maxRoads: 15,
	hexagonSpacing: 300,
	resources: { WHEAT, SHEEP, LUMBER, BRICK, ORE, DESERT },	
	resourceCards: { WHEAT, SHEEP, LUMBER, BRICK, ORE },
	devCards: {DEV_KNIGHT, DEV_VP, DEV_ROAD, DEV_MONOPOLY, DEV_PLENTY},
	devCardsExpanded: {
		DEV_KNIGHT: {id: DEV_KNIGHT, symbol: "Kn", color: "#000", name: "Knight", description: "When played, move the robber and draw a random card from one of the players who own property in the new location"}, 
		DEV_VP: {id: DEV_VP, symbol: "VP", color: "#111", name: "Victory Point", description: "This card does not need to be played. A victory point is automatically added to your total."}, 
		DEV_ROAD: {id: DEV_ROAD, symbol: "Rd", color: "#222", name: "Road Building", description: "When played, place 2 new roads as if you just built them"}, 
		DEV_MONOPOLY: {id: DEV_MONOPOLY, symbol: "Mo", color: "#333", name: "Monopoly", description: "Select a resource that all other players must hand over to you"}, 
		DEV_PLENTY: {id: DEV_PLENTY, symbol: "Pl", color: "#444", name: "Year of Plenty", description: "Take two resources and add them to your hand. You can use them immediately to build."}
	},
	DEV_KNIGHT, 
	DEV_VP, 
	DEV_ROAD, 
	DEV_MONOPOLY, 
	DEV_PLENTY,
	resourcesExpanded: {
		WHEAT: {id: WHEAT, color: "gold", hasCard: true},
		SHEEP: {id: SHEEP, color: "lightgreen", hasCard: true},
		LUMBER: {id: LUMBER, color: "forestgreen", hasCard: true},
		BRICK: {id: BRICK, color: "darkred", hasCard: true},
		ORE: {id: ORE, color: "silver", hasCard: true},
		DESERT: {id: DESERT, color: "tan", hasCard: false},
	},
	devCardDescriptions,
	resourceColorMap,
	resourceColorMapArray: [[WHEAT, "gold"], [SHEEP, "lightgreen"], [LUMBER, "forestgreen"], [BRICK, "darkred"], [ORE, "silver"], [DESERT, "tan"] ],
	resourceCardColorMapArray: [[WHEAT, "gold"], [SHEEP, "lightgreen"], [LUMBER, "forestgreen"], [BRICK, "darkred"], [ORE, "silver"] ],
	resourceDeck: [DESERT, WHEAT, WHEAT, WHEAT, WHEAT, SHEEP, SHEEP, SHEEP, SHEEP, LUMBER, LUMBER, LUMBER, LUMBER, BRICK, BRICK, BRICK, ORE, ORE, ORE ],
	hexagons: [
		{"index":0,"x":-1,"y":1.73205080756888,"adjNodes":[0,110,120,1,111,-11],"adjEdges":[0,110,1,2,-11,-182]},
		{"index":1,"x":3.33066907387547e-16,"y":1.73205080756888,"adjNodes":[10,120,130,1,11,121],"adjEdges":[10,120,1,11,12,-172]},
		{"index":2,"x":1,"y":1.73205080756888,"adjNodes":[20,30,130,11,21,131],"adjEdges":[20,130,11,21,22,-162]},
		{"index":3,"x":1.5,"y":0.866025403784439,"adjNodes":[30,40,140,31,131,141],"adjEdges":[30,140,31,131,22,32]},
		{"index":4,"x":2,"y":0,"adjNodes":[40,50,41,51,141,-110],"adjEdges":[40,50,41,141,32,42]},
		{"index":5,"x":1.5,"y":-0.866025403784439,"adjNodes":[50,60,51,61,151,-100],"adjEdges":[50,60,51,151,52,142]},
		{"index":6,"x":1,"y":-1.73205080756888,"adjNodes":[60,61,71,-80,-90,-81],"adjEdges":[60,61,71,62,152,-80]},
		{"index":7,"x":-3.33066907387547e-16,"y":-1.73205080756888,"adjNodes":[70,71,81,-70,-80,-71],"adjEdges":[70,71,81,72,162,-70]},
		{"index":8,"x":-1,"y":-1.73205080756888,"adjNodes":[80,81,-60,-70,-51,-61],"adjEdges":[80,81,82,92,-60,-51]},
		{"index":9,"x":-1.5,"y":-0.866025403784438,"adjNodes":[80,90,91,-50,-41,-51],"adjEdges":[90,91,92,102,-50,-41]},
		{"index":10,"x":-2,"y":2.45029690981724e-16,"adjNodes":[90,100,101,-40,-31,-41],"adjEdges":[100,101,102,-40,-31,-22]},
		{"index":11,"x":-1.5,"y":0.866025403784439,"adjNodes":[100,110,170,101,111,-21],"adjEdges":[100,110,111,112,-21,-12]},
		{"index":12,"x":-0.5,"y":0.866025403784439,"adjNodes":[120,170,180,111,121,171],"adjEdges":[120,170,111,121,2,122]},
		{"index":13,"x":0.5,"y":0.866025403784439,"adjNodes":[130,140,180,121,131,181],"adjEdges":[130,180,121,131,12,132]},
		{"index":14,"x":1,"y":0,"adjNodes":[50,140,150,141,151,181],"adjEdges":[140,150,141,181,132,142]},
		{"index":15,"x":0.5,"y":-0.866025403784439,"adjNodes":[60,70,150,71,151,161],"adjEdges":[70,150,151,161,152,182]},
		{"index":16,"x":-0.5,"y":-0.866025403784438,"adjNodes":[70,80,160,81,91,161],"adjEdges":[80,160,91,161,162,172]},
		{"index":17,"x":-1,"y":1.22514845490862e-16,"adjNodes":[90,160,170,91,101,171],"adjEdges":[90,170,101,171,112,172]},
		{"index":18,"x":0,"y":0,"adjNodes":[150,160,180,161,171,181],"adjEdges":[160,180,171,181,122,182]}
	],
	edges: [{"index":0,"x":-0.7500000000000299,"y":2.165063509461117,"adjNodes":[0,1],"adjEdges":[1,-172,-182],"adjHexagons":[0]},
		{"index":10,"x":0.24999999999997047,"y":2.165063509461117,"adjNodes":[10,11],"adjEdges":[11,-162,-172],"adjHexagons":[1]},
		{"index":20,"x":1.2499999999999702,"y":2.165063509461117,"adjNodes":[20,21],"adjEdges":[21,-162],"adjHexagons":[2]},
		{"index":30,"x":1.7499999999999702,"y":1.2990381056766755,"adjNodes":[30,31],"adjEdges":[21,31,22],"adjHexagons":[3]},
		{"index":40,"x":2.2499999999999702,"y":0.43301270189223656,"adjNodes":[40,41],"adjEdges":[31,41,32],"adjHexagons":[4]},
		{"index":50,"x":1.7499999999999702,"y":-0.4330127018922025,"adjNodes":[50,51],"adjEdges":[51,141,42,142],"adjHexagons":[4,5]},{"index":60,"x":1.2499999999999702,"y":-1.2990381056766436,"adjNodes":[60,61],"adjEdges":[61,151,52,152],"adjHexagons":[5,6]},{"index":70,"x":0.2499999999999698,"y":-1.2990381056766436,"adjNodes":[70,71],"adjEdges":[71,161,152,162],"adjHexagons":[7,15]},{"index":80,"x":-0.7500000000000299,"y":-1.2990381056766436,"adjNodes":[80,81],"adjEdges":[81,91,92,162],"adjHexagons":[8,16]},{"index":90,"x":-1.2500000000000298,"y":-0.4330127018922015,"adjNodes":[90,91],"adjEdges":[91,101,102,172],"adjHexagons":[9,17]},{"index":100,"x":-1.7500000000000298,"y":0.4330127018922368,"adjNodes":[100,101],"adjEdges":[101,112,-21,-22],"adjHexagons":[10,11]},{"index":110,"x":-1.2500000000000298,"y":1.2990381056766755,"adjNodes":[110,111],"adjEdges":[111,2,-11,-12],"adjHexagons":[0,11]},{"index":120,"x":-0.25000000000002986,"y":1.2990381056766755,"adjNodes":[120,121],"adjEdges":[1,121,2,12],"adjHexagons":[1,12]},{"index":130,"x":0.7499999999999701,"y":1.2990381056766755,"adjNodes":[130,131],"adjEdges":[11,131,12,22],"adjHexagons":[2,13]},{"index":140,"x":1.2499999999999702,"y":0.43301270189223656,"adjNodes":[140,141],"adjEdges":[131,141,32,132],"adjHexagons":[3,14]},{"index":150,"x":0.7499999999999701,"y":-0.4330127018922025,"adjNodes":[150,151],"adjEdges":[151,181,142,182],"adjHexagons":[14,15]},{"index":160,"x":-0.25000000000002986,"y":-0.4330127018922015,"adjNodes":[160,161],"adjEdges":[161,171,172,182],"adjHexagons":[16,18]},{"index":170,"x":-0.7500000000000299,"y":0.4330127018922367,"adjNodes":[170,171],"adjEdges":[111,171,112,122],"adjHexagons":[12,17]},{"index":180,"x":0.24999999999997014,"y":0.43301270189223656,"adjNodes":[180,181],"adjEdges":[121,181,122,132],"adjHexagons":[13,18]},{"index":1,"x":-0.5,"y":1.73205080756888,"adjNodes":[120,1],"adjEdges":[0,120,2,-172],"adjHexagons":[0,1]},{"index":11,"x":0.5000000000000003,"y":1.73205080756888,"adjNodes":[130,11],"adjEdges":[10,130,12,-162],"adjHexagons":[1,2]},{"index":21,"x":1.5,"y":1.73205080756888,"adjNodes":[30,21],"adjEdges":[20,30,22],"adjHexagons":[2]},{"index":31,"x":2,"y":0.866025403784439,"adjNodes":[40,31],"adjEdges":[30,40,32],"adjHexagons":[3]},{"index":41,"x":2.5,"y":0,"adjNodes":[41,-110],"adjEdges":[40,42],"adjHexagons":[4]},{"index":51,"x":2,"y":-0.866025403784439,"adjNodes":[51,-100],"adjEdges":[50,42,52],"adjHexagons":[5]},{"index":61,"x":1.5,"y":-1.73205080756888,"adjNodes":[61,-90],"adjEdges":[60,52,62],"adjHexagons":[6]},{"index":71,"x":0.49999999999999967,"y":-1.73205080756888,"adjNodes":[71,-80],"adjEdges":[70,72,152,-80],"adjHexagons":[6,7]},{"index":81,"x":-0.5,"y":-1.73205080756888,"adjNodes":[81,-70],"adjEdges":[80,82,162,-70],"adjHexagons":[7,8]},{"index":91,"x":-1,"y":-0.866025403784438,"adjNodes":[80,91],"adjEdges":[80,90,92,172],"adjHexagons":[9,16]},{"index":101,"x":-1.5,"y":2.45029690981724e-16,"adjNodes":[90,101],"adjEdges":[90,100,102,112],"adjHexagons":[10,17]},{"index":111,"x":-1,"y":0.866025403784439,"adjNodes":[170,111],"adjEdges":[110,170,2,112],"adjHexagons":[11,12]},{"index":121,"x":0,"y":0.866025403784439,"adjNodes":[180,121],"adjEdges":[120,180,12,122],"adjHexagons":[12,13]},{"index":131,"x":1,"y":0.866025403784439,"adjNodes":[140,131],"adjEdges":[130,140,22,132],"adjHexagons":[3,13]},{"index":141,"x":1.5,"y":0,"adjNodes":[50,141],"adjEdges":[50,140,32,142],"adjHexagons":[4,14]},{"index":151,"x":1,"y":-0.866025403784439,"adjNodes":[60,151],"adjEdges":[60,150,142,152],"adjHexagons":[5,15]},{"index":161,"x":0,"y":-0.866025403784438,"adjNodes":[70,161],"adjEdges":[70,160,162,182],"adjHexagons":[15,16]},{"index":171,"x":-0.5,"y":1.22514845490862e-16,"adjNodes":[160,171],"adjEdges":[160,170,122,172],"adjHexagons":[17,18]},{"index":181,"x":0.5,"y":0,"adjNodes":[150,181],"adjEdges":[150,180,132,182],"adjHexagons":[14,18]},{"index":2,"x":-0.7500000000000299,"y":1.2990381056766436,"adjNodes":[120,111],"adjEdges":[110,120,1,111],"adjHexagons":[0,12]},{"index":12,"x":0.24999999999997047,"y":1.2990381056766436,"adjNodes":[130,121],"adjEdges":[120,130,11,121],"adjHexagons":[1,13]},{"index":22,"x":1.2499999999999702,"y":1.2990381056766436,"adjNodes":[30,131],"adjEdges":[30,130,21,131],"adjHexagons":[2,3]},{"index":32,"x":1.7499999999999702,"y":0.4330127018922025,"adjNodes":[40,141],"adjEdges":[40,140,31,141],"adjHexagons":[3,4]},{"index":42,"x":2.2499999999999702,"y":-0.43301270189223656,"adjNodes":[51,-110],"adjEdges":[50,41,51],"adjHexagons":[4]},{"index":52,"x":1.7499999999999702,"y":-1.2990381056766755,"adjNodes":[61,-100],"adjEdges":[60,51,61],"adjHexagons":[5]},{"index":62,"x":1.2499999999999702,"y":-2.165063509461117,"adjNodes":[-90,-81],"adjEdges":[61,-80],"adjHexagons":[6]},{"index":72,"x":0.2499999999999698,"y":-2.165063509461117,"adjNodes":[-80,-71],"adjEdges":[71,-70,-80],"adjHexagons":[7]},{"index":82,"x":-0.7500000000000299,"y":-2.165063509461117,"adjNodes":[-70,-61],"adjEdges":[81,-60,-70],"adjHexagons":[8]},{"index":92,"x":-1.2500000000000298,"y":-1.2990381056766747,"adjNodes":[80,-51],"adjEdges":[80,91,-50,-51],"adjHexagons":[8,9]},{"index":102,"x":-1.7500000000000298,"y":-0.43301270189223634,"adjNodes":[90,-41],"adjEdges":[90,101,-40,-41],"adjHexagons":[9,10]},{"index":112,"x":-1.2500000000000298,"y":0.4330127018922025,"adjNodes":[170,101],"adjEdges":[100,170,101,111],"adjHexagons":[11,17]},{"index":122,"x":-0.25000000000002986,"y":0.4330127018922025,"adjNodes":[180,171],"adjEdges":[170,180,121,171],"adjHexagons":[12,18]},{"index":132,"x":0.7499999999999701,"y":0.4330127018922025,"adjNodes":[140,181],"adjEdges":[140,180,131,181],"adjHexagons":[13,14]},{"index":142,"x":1.2499999999999702,"y":-0.43301270189223656,"adjNodes":[50,151],"adjEdges":[50,150,141,151],"adjHexagons":[5,14]},{"index":152,"x":0.7499999999999701,"y":-1.2990381056766755,"adjNodes":[60,71],"adjEdges":[60,70,71,151],"adjHexagons":[6,15]},{"index":162,"x":-0.25000000000002986,"y":-1.2990381056766747,"adjNodes":[70,81],"adjEdges":[70,80,81,161],"adjHexagons":[7,16]},{"index":172,"x":-0.7500000000000299,"y":-0.43301270189223645,"adjNodes":[160,91],"adjEdges":[90,160,91,171],"adjHexagons":[16,17]},{"index":182,"x":0.24999999999997014,"y":-0.43301270189223656,"adjNodes":[150,161],"adjEdges":[150,160,161,181],"adjHexagons":[15,18]},{"index":-40,"x":-2.2500000000000298,"y":-0.4330127018922015,"adjNodes":[-40,-41],"adjEdges":[102,-31,-41],"adjHexagons":[10]},{"index":-50,"x":-1.7500000000000298,"y":-1.2990381056766436,"adjNodes":[-50,-51],"adjEdges":[92,-41,-51],"adjHexagons":[9]},{"index":-60,"x":-1.2500000000000298,"y":-2.1650635094610835,"adjNodes":[-60,-61],"adjEdges":[82,-51],"adjHexagons":[8]},{"index":-70,"x":-0.25000000000003086,"y":-2.1650635094610835,"adjNodes":[-70,-71],"adjEdges":[81,72,82],"adjHexagons":[7]},{"index":-80,"x":0.7499999999999691,"y":-2.1650635094610835,"adjNodes":[-80,-81],"adjEdges":[71,62,72],"adjHexagons":[6]},{"index":-11,"x":-1.5,"y":1.73205080756888,"adjNodes":[110,-11],"adjEdges":[110,-12,-182],"adjHexagons":[0]},{"index":-21,"x":-2,"y":0.866025403784439,"adjNodes":[100,-21],"adjEdges":[100,-12,-22],"adjHexagons":[11]},{"index":-31,"x":-2.5,"y":3.67544536472586e-16,"adjNodes":[-40,-31],"adjEdges":[-40,-22],"adjHexagons":[10]},{"index":-41,"x":-2,"y":-0.866025403784438,"adjNodes":[-50,-41],"adjEdges":[102,-40,-50],"adjHexagons":[9]},{"index":-51,"x":-1.5,"y":-1.73205080756888,"adjNodes":[-60,-51],"adjEdges":[92,-50,-60],"adjHexagons":[8]},{"index":-12,"x":-1.7500000000000298,"y":1.2990381056766436,"adjNodes":[110,-21],"adjEdges":[110,-11,-21],"adjHexagons":[11]},{"index":-22,"x":-2.2500000000000298,"y":0.4330127018922025,"adjNodes":[100,-31],"adjEdges":[100,-21,-31],"adjHexagons":[10]},{"index":-162,"x":0.7499999999999711,"y":2.1650635094610835,"adjNodes":[20,11],"adjEdges":[10,20,11],"adjHexagons":[2]},{"index":-172,"x":-0.25000000000002887,"y":2.1650635094610835,"adjNodes":[10,1],"adjEdges":[0,10,1],"adjHexagons":[1]},
		{"index":-182,"x":-1.2500000000000298,"y":2.1650635094610835,"adjNodes":[0,-11],"adjEdges":[0,-11],"adjHexagons":[0]}],
	nodes: [{"index":0,"x":-1.0000000000000597,"y":2.309401076758506,"adjNodes":[1,-11],"adjEdges":[0,-182],"adjHexagons":[0]},{"index":10,"x":-5.937162137497102e-14,"y":2.309401076758506,"adjNodes":[1,11],"adjEdges":[10,-172],"adjHexagons":[1]},{"index":20,"x":0.9999999999999403,"y":2.309401076758506,"adjNodes":[11,21],"adjEdges":[20,-162],"adjHexagons":[2]},{"index":30,"x":1.4999999999999403,"y":1.443375672974065,"adjNodes":[21,31,131],"adjEdges":[30,21,22],"adjHexagons":[2,3]},{"index":40,"x":1.9999999999999403,"y":0.5773502691896258,"adjNodes":[31,41,141],"adjEdges":[40,31,32],"adjHexagons":[3,4]},{"index":50,"x":1.4999999999999403,"y":-0.2886751345948132,"adjNodes":[51,141,151],"adjEdges":[50,141,142],"adjHexagons":[4,5,14]},{"index":60,"x":0.9999999999999403,"y":-1.1547005383792541,"adjNodes":[61,71,151],"adjEdges":[60,151,152],"adjHexagons":[5,6,15]},{"index":70,"x":-6.003775518974611e-14,"y":-1.1547005383792541,"adjNodes":[71,81,161],"adjEdges":[70,161,162],"adjHexagons":[7,15,16]},{"index":80,"x":-1.0000000000000597,"y":-1.1547005383792541,"adjNodes":[81,91,-51],"adjEdges":[80,91,92],"adjHexagons":[8,9,16]},{"index":90,"x":-1.5000000000000597,"y":-0.2886751345948122,"adjNodes":[91,101,-41],"adjEdges":[90,101,102],"adjHexagons":[9,10,17]},{"index":100,"x":-2.0000000000000595,"y":0.5773502691896261,"adjNodes":[101,-21,-31],"adjEdges":[100,-21,-22],"adjHexagons":[10,11]},{"index":110,"x":-1.5000000000000597,"y":1.443375672974065,"adjNodes":[111,-11,-21],"adjEdges":[110,-11,-12],"adjHexagons":[0,11]},{"index":120,"x":-0.5000000000000597,"y":1.443375672974065,"adjNodes":[1,111,121],"adjEdges":[120,1,2],"adjHexagons":[0,1,12]},{"index":130,"x":0.49999999999994027,"y":1.443375672974065,"adjNodes":[11,121,131],"adjEdges":[130,11,12],"adjHexagons":[1,2,13]},{"index":140,"x":0.9999999999999403,"y":0.5773502691896258,"adjNodes":[131,141,181],"adjEdges":[140,131,132],"adjHexagons":[3,13,14]},{"index":150,"x":0.49999999999994027,"y":-0.2886751345948132,"adjNodes":[151,161,181],"adjEdges":[150,181,182],"adjHexagons":[14,15,18]},{"index":160,"x":-0.5000000000000597,"y":-0.2886751345948122,"adjNodes":[91,161,171],"adjEdges":[160,171,172],"adjHexagons":[16,17,18]},{"index":170,"x":-1.0000000000000597,"y":0.577350269189626,"adjNodes":[101,111,171],"adjEdges":[170,111,112],"adjHexagons":[11,12,17]},{"index":180,"x":-5.970468828235856e-14,"y":0.5773502691896258,"adjNodes":[121,171,181],"adjEdges":[180,121,122],"adjHexagons":[12,13,18]},{"index":1,"x":-0.5000000000000099,"y":2.0207259421637103,"adjNodes":[0,10,120],"adjEdges":[0,1,-172],"adjHexagons":[0,1]},{"index":11,"x":0.49999999999999045,"y":2.0207259421637103,"adjNodes":[10,20,130],"adjEdges":[10,11,-162],"adjHexagons":[1,2]},{"index":21,"x":1.4999999999999902,"y":2.0207259421637103,"adjNodes":[20,30],"adjEdges":[20,21],"adjHexagons":[2]},{"index":31,"x":1.9999999999999902,"y":1.1547005383792692,"adjNodes":[30,40],"adjEdges":[30,31],"adjHexagons":[3]},{"index":41,"x":2.4999999999999902,"y":0.2886751345948302,"adjNodes":[40,-110],"adjEdges":[40,41],"adjHexagons":[4]},{"index":51,"x":1.9999999999999902,"y":-0.5773502691896089,"adjNodes":[50,-100,-110],"adjEdges":[50,51,42],"adjHexagons":[4,5]},{"index":61,"x":1.4999999999999902,"y":-1.44337567297405,"adjNodes":[60,-90,-100],"adjEdges":[60,61,52],"adjHexagons":[5,6]},{"index":71,"x":0.4999999999999898,"y":-1.44337567297405,"adjNodes":[60,70,-80],"adjEdges":[70,71,152],"adjHexagons":[6,7,15]},{"index":81,"x":-0.5000000000000099,"y":-1.44337567297405,"adjNodes":[70,80,-70],"adjEdges":[80,81,162],"adjHexagons":[7,8,16]},{"index":91,"x":-1.0000000000000098,"y":-0.5773502691896079,"adjNodes":[80,90,160],"adjEdges":[90,91,172],"adjHexagons":[9,16,17]},{"index":101,"x":-1.5000000000000098,"y":0.2886751345948304,"adjNodes":[90,100,170],"adjEdges":[100,101,112],"adjHexagons":[10,11,17]},{"index":111,"x":-1.0000000000000098,"y":1.1547005383792692,"adjNodes":[110,120,170],"adjEdges":[110,111,2],"adjHexagons":[0,11,12]},{"index":121,"x":-9.880984919163893e-15,"y":1.1547005383792692,"adjNodes":[120,130,180],"adjEdges":[120,121,12],"adjHexagons":[1,12,13]},{"index":131,"x":0.9999999999999901,"y":1.1547005383792692,"adjNodes":[30,130,140],"adjEdges":[130,131,22],"adjHexagons":[2,3,13]},{"index":141,"x":1.4999999999999902,"y":0.2886751345948302,"adjNodes":[40,50,140],"adjEdges":[140,141,32],"adjHexagons":[3,4,14]},{"index":151,"x":0.9999999999999901,"y":-0.5773502691896089,"adjNodes":[50,60,150],"adjEdges":[150,151,142],"adjHexagons":[5,14,15]},{"index":161,"x":-9.880984919163893e-15,"y":-0.5773502691896079,"adjNodes":[70,150,160],"adjEdges":[160,161,182],"adjHexagons":[15,16,18]},{"index":171,"x":-0.5000000000000099,"y":0.2886751345948303,"adjNodes":[160,170,180],"adjEdges":[170,171,122],"adjHexagons":[12,17,18]},{"index":181,"x":0.4999999999999901,"y":0.2886751345948302,"adjNodes":[140,150,180],"adjEdges":[180,181,132],"adjHexagons":[13,14,18]},{"index":-40,"x":-2.5000000000000595,"y":-0.2886751345948122,"adjNodes":[-31,-41],"adjEdges":[-40,-31],"adjHexagons":[10]},{"index":-50,"x":-2.0000000000000595,"y":-1.1547005383792541,"adjNodes":[-41,-51],"adjEdges":[-50,-41],"adjHexagons":[9]},{"index":-60,"x":-1.5000000000000597,"y":-2.0207259421636943,"adjNodes":[-51,-61],"adjEdges":[-60,-51],"adjHexagons":[8]},{"index":-70,"x":-0.5000000000000607,"y":-2.0207259421636943,"adjNodes":[81,-61,-71],"adjEdges":[81,82,-70],"adjHexagons":[7,8]},{"index":-80,"x":0.49999999999993927,"y":-2.0207259421636943,"adjNodes":[71,-71,-81],"adjEdges":[71,72,-80],"adjHexagons":[6,7]},{"index":-90,"x":1.4999999999999403,"y":-2.0207259421636943,"adjNodes":[61,-81],"adjEdges":[61,62],"adjHexagons":[6]},{"index":-100,"x":1.9999999999999403,"y":-1.1547005383792541,"adjNodes":[51,61],"adjEdges":[51,52],"adjHexagons":[5]},{"index":-110,"x":2.4999999999999405,"y":-0.2886751345948132,"adjNodes":[41,51],"adjEdges":[41,42],"adjHexagons":[4]},{"index":-11,"x":-1.5000000000000098,"y":2.0207259421637103,"adjNodes":[0,110],"adjEdges":[-11,-182],"adjHexagons":[0]},{"index":-21,"x":-2.0000000000000098,"y":1.1547005383792692,"adjNodes":[100,110],"adjEdges":[-21,-12],"adjHexagons":[11]},{"index":-31,"x":-2.5000000000000098,"y":0.2886751345948306,"adjNodes":[100,-40],"adjEdges":[-31,-22],"adjHexagons":[10]},{"index":-41,"x":-2.0000000000000098,"y":-0.5773502691896079,"adjNodes":[90,-40,-50],"adjEdges":[102,-40,-41],"adjHexagons":[9,10]},{"index":-51,"x":-1.5000000000000098,"y":-1.44337567297405,"adjNodes":[80,-50,-60],"adjEdges":[92,-50,-51],"adjHexagons":[8,9]},{"index":-61,"x":-1.0000000000000098,"y":-2.3094010767584896,"adjNodes":[-60,-70],"adjEdges":[82,-60],"adjHexagons":[8]},{"index":-71,"x":-1.0880185641326534e-14,"y":-2.3094010767584896,"adjNodes":[-70,-80],"adjEdges":[72,-70],"adjHexagons":[7]},{"index":-81,"x":0.9999999999999891,"y":-2.3094010767584896,"adjNodes":[-80,-90],"adjEdges":[62,-80],"adjHexagons":[6]}],
};



