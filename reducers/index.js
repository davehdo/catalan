// import createReducer from 

// state should look like {
//		game:
//		map:
// }

// actions
// END_TURN
// ROLL
// BUILD
// { type: "BUILD_EDGE", userId: _, edgeId: _ }
// { type: "BUILD_NODE", userId: _, edgeId: _ }

const Globals = require("../Globals.js")


import { combineReducers } from "redux";


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


const players = ( state, action) => {
	if( typeof( state ) == "undefined" ) {
		let houses = ["House Stark", "House Lannister", "House Tyrell"]
		let colors = ["black", "teal", "red"]
		let lastId = 0
		return houses.map((h) => {
			return({
				id: lastId++,
				name: h,
				color: colors.shift()
			})
		})		
	}
	
	return state
}

// { type: "BUILD_EDGE", userId: _, edgeId: _ }
// { type: "BUILD_NODE", userId: _, nodeId: _ }
const map = (state, action) => {
	if( typeof(state) == "undefined") {		
		let numbers = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11]
		let resources = shuffle(Globals.resourceDeck) //.sort((r)=> r ? Math.random() : 0)		
		let hexagonContents = {}
		
		resources.map((r,i) => { 
			hexagonContents[i] = ({ 
				resource: r,
				number: num = (r == Globals.resources.DESERT) ? undefined : numbers.shift(), 
			})
		})
		
		let nodeContents = {} //  
		let edgeContents = {}
		
		return {
			hexagonContents,
			nodeContents,
			edgeContents
		}
	}
	
	switch( action.type ) {
		case "BUILD_EDGE":
			let add = {}
			add[ action.edgeId ] = { road: true, userId: action.userId }
			return {
				hexagonContents: state.hexagonContents,
				nodeContents: state.nodeContents,
				edgeContents: Object.assign({}, state.edgeContents, add),
			}
		case "BUILD_NODE":
			let nodeObj = {}
			nodeObj[ action.nodeId ] = { buildingType: 1, userId: action.userId }
			
			return {
				hexagonContents: state.hexagonContents,
				nodeContents: Object.assign({}, state.nodeContents, nodeObj),
				edgeContents: state.edgeContents,
			}
		default:
			return state
	}
	
}

const game = ( state, action ) => {
	if( typeof(state) == "undefined" )
		return {
			players: players(), 
			round: 0, 
			turn: 0,
			thisTurnRolled: undefined
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
		default:
			return state;
	}
}


export const combinedReducer = combineReducers({
	game: game,
	map: map
})