// import createReducer from 

// state should look like {
//		game:
//		map:
// }

// actions
// END_TURN
// ROLL
// { type: "ADJUST_RESOURCES", userId, ORE: _, BRICK: _, LUMBER: _, SHEEP: _, WHEAT: _}
// { type: "BUILD_EDGE", userId: _, edgeId: _ }
// { type: "BUILD_NODE", userId: _, nodeId: _ }

const Globals = require("../Globals.js")
const Redux = require( "redux")
const combineReducers = Redux.combineReducers
// import { combineReducers } from "redux";


const shuffle = (array) => {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}


const makeId = (len = 32 ) => {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

const resourceCount = (state, action) => {
	if( typeof( state ) == "undefined" ) {
		let resourceCount = {}
		Object.keys(Globals.resourceCards).map((v) => resourceCount[v] = 10)
		return resourceCount
	}
	
	switch( action.type ) {
		case "ADJUST_RESOURCES":
			let newResourceCount = {}
			Object.keys(Globals.resourceCards).map((v) => newResourceCount[v] = state[v] + (action[v] || 0))
			return newResourceCount

		default:
			return state
		
	}
}


const devCount = (state, action) => {
	if( typeof( state ) == "undefined" ) {
		let devCount = {}
		Object.keys(Globals.devCards).map((v) => devCount[v] = 0)
		return devCount
	}

	let newDevCount = {}	
	switch( action.type ) {
		case "DRAW_DEV_CARD": // rand, userId
			let newDevCard 
			if (action.rand < 14 / 25 ) {
				newDevCard = Globals.DEV_KNIGHT
			} else if (action.rand < 19 / 25 ) {
				newDevCard = Globals.DEV_VP
			} else if (action.rand < 21 / 25) {
				newDevCard = Globals.DEV_ROAD
			} else if (action.rand < 23 / 25) {
				newDevCard = Globals.DEV_MONOPOLY
			} else {
				newDevCard = Globals.DEV_PLENTY
			}
			newDevCount[newDevCard] = (state[newDevCard] || 0) + 1
			return Object.assign({}, state, newDevCount)
		case "USE_DEV_CARD": // userId, card
			newDevCount[action.card] = (state[action.card] || 0) - 1
			return Object.assign({}, state, newDevCount)
		default:
			return state
		
	}
}


const devUsedCount = (state, action) => {
	if( typeof( state ) == "undefined" ) {
		let devCount = {}
		Object.keys(Globals.devCards).map((v) => devCount[v] = 0)
		return devCount
	}

	let newdevCount = {}	
	switch( action.type ) {
		case "USE_DEV_CARD": // userId, card
			newdevCount[action.card] = (state[action.card] || 0) + 1
			return Object.assign({}, state, newdevCount)
		default:
			return state
		
	}
}


// { type: "ADJUST_RESOURCES", userId, ORE: _, BRICK: _, LUMBER: _, SHEEP: _, WHEAT: _}
const player = ( state, action) => {
	if( typeof( state ) == "undefined" ) {
		return {
			id: makeId(),
			name: "Unnamed player",
			color: "white",
			resourceCount: resourceCount(undefined, {}),
			devCount: devCount(undefined, {}),
			devUsedCount: devUsedCount(undefined, {}),
			lastResourceAdjustment: undefined
		}
	}
	switch( action.type ) {
		case "DRAW_DEV_CARD":
			return action.userId == state.id ? Object.assign({}, state, {devCount: devCount( state.devCount, action) }) : state
		case "ADJUST_RESOURCES":
			let resourcesOnly = {}
			Object.keys( action ).map((e) => {if (!["userId", "type"].includes(e)) {resourcesOnly[e] = action[e]}})
			return Object.assign({}, state, {
				resourceCount: resourceCount( state.resourceCount, action),
				lastResourceAdjustment: resourcesOnly
			})
		case "USE_DEV_CARD":
			return Object.assign({}, state, {devCount: devCount( state.devCount, action), devUsedCount: devUsedCount( state.devUsedCount, action) })
		default:
			return state
	}	
	
}

const players = ( state, action) => {
	if( typeof( state ) == "undefined" ) {
		let houses = ["House Stark", "House Lannister", "House Tyrell"]
		let colors = ["black", "teal", "red", "white"]
		let lastId = 0
		
		return houses.map((h) => {
			return(Object.assign(player(undefined, {}), {
				id: lastId++,
				name: h,
				color: colors.shift()
			}))
		})
	}
	
	switch( action.type ) {
		case "ADJUST_RESOURCES":
			return state.map((p) => (p.id != undefined && p.id == action.userId) ? player(p, action) : p) 
		case "USE_DEV_CARD":
			return state.map((p) => (p.id != undefined && p.id == action.userId) ? player(p, action) : p) 
		case "DRAW_DEV_CARD":
			return state.map((p) => (p.id != undefined && p.id == action.userId) ? player(p, action) : p) 
		
		// case "BUILD_EDGE":
		// 	let add = {}
		// 	add[ action.edgeId ] = { road: true, userId: action.userId }
		// 	return {
		// 		hexagonContents: state.hexagonContents,
		// 		nodeContents: state.nodeContents,
		// 		edgeContents: Object.assign({}, state.edgeContents, add),
		// 	}
		// case "BUILD_NODE":
		// 	let nodeObj = {}
		// 	let priorBuildingType = state.nodeContents[ action.nodeId ] ? state.nodeContents[ action.nodeId ].buildingType : 0
		// 	nodeObj[ action.nodeId ] = { buildingType: priorBuildingType >= 2 ? 2 : priorBuildingType + 1, userId: action.userId }
		//
		// 	return {
		// 		hexagonContents: state.hexagonContents,
		// 		nodeContents: Object.assign({}, state.nodeContents, nodeObj),
		// 		edgeContents: state.edgeContents,
		// 	}
		default:
			return state
	}
	
}

const nodeContents = (state, action) => {
	if (typeof(state) == "undefined") {
		return {}
	}
		
	switch( action.type ) {
		case "BUILD_NODE":
			let nodeObj = {}
			let priorBuildingType = state[ action.nodeId ] ? state[ action.nodeId ].buildingType : 0
			nodeObj[ action.nodeId ] = { buildingType: priorBuildingType >= 2 ? 2 : priorBuildingType + 1, userId: action.userId }
			
			return Object.assign({}, state, nodeObj)
		default:
			return state
	}
}
const edgeContents = (state, action) => {
	if (typeof(state) == "undefined") {
		
		return {}
	}
	
	switch( action.type ) {
		case "BUILD_EDGE":
			let add = {}
			add[ action.edgeId ] = { road: true, userId: action.userId }
			return Object.assign({}, state, add)
		default:
			return state
	}
	
}

const hexagonContents = (state, action) => {
	if( typeof(state) == "undefined") {
		let numbers = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11]
		let resources = shuffle(Globals.resourceDeck) //.sort((r)=> r ? Math.random() : 0)
		let hexagonContents = {}

		resources.map((r,i) => {
			hexagonContents[i] = ({
				resource: r,
				number: (r == Globals.resources.DESERT) ? undefined : numbers.shift(),
				robber: r == Globals.resources.DESERT
			})
		})
		
		return hexagonContents
	}
	
	switch( action.type ) {
		case "MOVE_ROBBER":
			
			let update = {}
			Object.keys( state ).map((k) => {
				update[k] = Object.assign({}, state[k], {robber: k == action.hexId}) 
			})
			return Object.assign({}, state, update )
		default:
			return state
	}

	
}
// { type: "BUILD_EDGE", userId: _, edgeId: _ }
// { type: "BUILD_NODE", userId: _, nodeId: _ }
// { type: "MOVE_ROBBER", hexId: _ }
const map = (state, action) => {
	if( typeof(state) == "undefined") {
		return {
			hexagonContents: hexagonContents( undefined, {}),
			nodeContents: nodeContents(undefined, {}),
			edgeContents: edgeContents(undefined, {})
		}
	}
	//
	switch( action.type ) {
		case "BUILD_EDGE":
			return Object.assign({}, state, {edgeContents: edgeContents( state.edgeContents, action)})
		case "BUILD_NODE":
			return Object.assign({}, state, {nodeContents: nodeContents( state.nodeContents, action)})
		case "MOVE_ROBBER":
			return Object.assign({}, state, {hexagonContents: hexagonContents( state.hexagonContents, action)})
		default:
			return state
	}
	
}

// // { type: "ADJUST_RESOURCES", userId, ORE: _, BRICK: _, LUMBER: _, SHEEP: _, WHEAT: _}

const game = ( state, action ) => {
	if( typeof(state) == "undefined" )
		return {
			players: players(undefined, {}), 
			round: 0, 
			turn: 0,
			thisTurnRolled: undefined,
			requireRobberMove: false,
			roadBuildingCredits: 0,
			thisTurnDevCardPlayed: false
		}
	switch( action.type ) {
		case "END_TURN":
			return Object.assign(
				{}, 
				state, 
				(state.turn >= state.players.length - 1) ? {turn: 0, round: state.round + 1, thisTurnRolled: undefined} : { turn: state.turn + 1, thisTurnRolled: undefined}
			);
		case "ROLL":
			return Object.assign(
				{}, 
				state, 
				{ thisTurnRolled: action.rollValue }
			);
		case "ADJUST_RESOURCES":
			return Object.assign(
				{}, 
				state, 
				{ players: players( state.players, action) }
			);
		case "REQUIRE_ROBBER_MOVE":
			return Object.assign(
				{}, 
				state, 
				{ requireRobberMove: true }
			);
		case "MOVE_ROBBER":
			return Object.assign(
				{}, 
				state, 
				{ requireRobberMove: false }
			);
		case "REDEEM_ROAD_CREDIT":
			return Object.assign(
				{}, 
				state, 
				{ roadBuildingCredits: state.roadBuildingCredits - 1 }
			);			
		case "USE_DEV_CARD":
			return Object.assign(
				{}, 
				state, 
				{ 
					roadBuildingCredits: state.roadBuildingCredits + (action.card == "DEV_ROAD" ? 2 : 0), 
					players: players( state.players, action ) ,
					thisTurnDevCardPlayed: true,
					requireRobberMove: (action.card == "DEV_KNIGHT") ? true : state.requireRobberMove
				}
			);
		default:
			return Object.assign(
				{}, 
				state, 
				{ players: players( state.players, action ) }
			);
	}
}


module.exports = { 
	game, 
	map, 
	resourceCount,
	player,
	players,
	edgeContents,
	nodeContents,
	hexagonContents,
	devCount,
	devUsedCount,
	reducerMaster: combineReducers({
		game,
		map
	})
}