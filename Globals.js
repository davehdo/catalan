'use strict';


const WHEAT = Symbol("WHEAT");
const SHEEP = Symbol("SHEEP");
const LUMBER = Symbol("LUMBER");
const BRICK = Symbol("BRICK");
const ORE = Symbol("ORE");
const DESERT = Symbol("DESERT");


let resourceColorMap = {}

resourceColorMap["DESERT"] = "tan",
resourceColorMap["ORE"] = "silver",
resourceColorMap["BRICK"] = "darkred",
resourceColorMap["LUMBER"] = "forestgreen",
resourceColorMap["SHEEP"] = "lightgreen",
resourceColorMap["WHEAT"] = "gold"


module.exports = {
	maxSettlements: 5, // Each player has a supply of 15 roads, 5 settlements, and 4 cities.
	maxCities: 4,
	maxRoads: 15,
	hexagonSpacing: 200,
	hexagonCoordinates: {
		18: {x: 0, y: 0}, 
		14: {x: 1, y: 0}, 
		13: {x: 0.5, y: 0.866025403784439}, 
		12: {x: -0.5, y: 0.866025403784439}, 
		17: {x: -1, y: 1.22514845490862E-16}, 
		16: {x: -0.5, y: -0.866025403784438}, 
		15: {x: 0.5, y: -0.866025403784439}, 
		4: {x: 2, y: 0}, 
		2: {x: 1, y: 1.73205080756888}, 
		0: {x: -1, y: 1.73205080756888}, 
		10: {x: -2, y: 2.45029690981724E-16}, 
		8: {x: -1, y: -1.73205080756888}, 
		6: {x: 1, y: -1.73205080756888}, 
		3: {x: 1.5, y: 0.866025403784439}, 
		1: {x: 3.33066907387547E-16, y: 1.73205080756888}, 
		9: {x: -1.5, y: -0.866025403784438}, 
		7: {x: -3.33066907387547E-16, y: -1.73205080756888}, 
		5: {x: 1.5, y: -0.866025403784439}, 
		11: {x: -1.5, y: 0.866025403784439}, 
		"-18": {x: -1.5, y: 2.59807621135332}, 
		"-17": {x: -0.499999999999999, y: 2.59807621135332}, 
		"-16": {x: 0.500000000000001, y: 2.59807621135332}, 
		"-1": {x: -2, y: 1.73205080756888}, 
		"-2": {x: -2.5, y: 0.866025403784439}, 
		"-3": {x: -3, y: 3.67544536472586E-16}, 
		"-4": {x: -2.5, y: -0.866025403784438}, 
		"-5": {x: -2, y: -1.73205080756888}, 
		"-6": {x: -1.5, y: -2.59807621135332}, 
		"-7": {x: -0.500000000000001, y: -2.59807621135332}, 
		"-8": {x: 0.499999999999999, y: -2.59807621135332},
		"-9": {x: 1.5, y: -2.59807621135332}, 
		"-10": {x: 2, y: -1.73205080756888}, 
		"-11": {x: 2.5, y: -0.866025403784439}, 
		"-12": {x: 3, y: 0}, 
	},
	resources: {
		WHEAT: WHEAT, SHEEP: SHEEP, LUMBER: LUMBER, BRICK: BRICK, ORE: ORE, DESERT: DESERT
	},
	resourceColorMap: resourceColorMap,
	resourceColorMapArray: [[WHEAT, "gold"], [SHEEP, "lightgreen"], [LUMBER, "forestgreen"], [BRICK, "darkred"], [ORE, "silver"], [DESERT, "tan"] ],
	resourceCardColorMapArray: [[WHEAT, "gold"], [SHEEP, "lightgreen"], [LUMBER, "forestgreen"], [BRICK, "darkred"], [ORE, "silver"] ],
	resourceDeck: [DESERT, WHEAT, WHEAT, WHEAT, WHEAT, SHEEP, SHEEP, SHEEP, SHEEP, LUMBER, LUMBER, LUMBER, LUMBER, BRICK, BRICK, BRICK, ORE, ORE, ORE ]
};



