// import createReducer from 

// state should look like {
//		game:
//		map:
// }

import { combineReducers } from "redux";


const counter = ( state = 0, action ) => {
	switch( action.type ) {
		case "INCREMENT":
			return state;
		case "DECREMENT":
			return state;
		default:
			return state;
	}
}

export const combinedReducer = combineReducers({
	counter: counter
})