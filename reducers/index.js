// import createReducer from 

// state should look like {
//		game:
//		map:
// }

// actions
// END_TURN
// ROLL
// BUILD


import { combineReducers } from "redux";


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
		return houses.map((h) => {
			return({
				id: makeId(),
				name: h,
				color: colors.shift()
			})
		})		
	}
	
	return state
}


const game = ( state, action ) => {
	if( typeof(state) == "undefined" )
		return {
			players: players(), 
			round: 0, 
			turn: 0,
			lastRoll: undefined
		}
	switch( action.type ) {
		case "END_TURN":
			return Object.assign(
				{}, 
				state, 
				(state.turn >= state.players.length) ? {turn: 0, round: state.round + 1} : { turn: state.turn + 1}
			);
		case "ROLL":
			return Object.assign(
				{}, 
				state, 
				{ lastRoll: action.rollValue }
			);
		default:
			return state;
	}
}


export const combinedReducer = combineReducers({
	game: game
})