/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  // Text,
  // View,
	NavigatorIOS
} from 'react-native';

import { createStore, applyMiddleware, combineReducers, compose} from "redux";
import {Provider} from "react-redux";
import thunkMiddleware from "redux-thunk"
import {createLogger} from "redux-logger"

const Reducer = require("./reducers/index")

const loggerMiddleware = createLogger({ predicte: (getState, action) => __DEV__ })
const configureStore = (initialState) => {
	const enhancer = compose(
		applyMiddleware(
			thunkMiddleware,
			loggerMiddleware
		),
	);
	return createStore(Reducer.reducerMaster, initialState, enhancer)
}

// store methods are getState, dispatch, and subscribe

const store = configureStore({})
// store.subscripe( render )
const GamesShow = require('./GamesShow');
const GamesIndex = require('./GamesIndex');
const WorldMap = require('./WorldMap');
const User = require('./User.js');
//
// store.subscribe(() =>
// 	console.log(store.getState())
// )

export default class Catalan extends Component {
	constructor() {
		
		super()
		// this.signedInUser = new User({name: "House Lannister", color: "red"})
		// this.users = [
		// 	new User({name: "House Tyrell", color: "teal"}),
		// 	new User({name: "House Fray", color: "black"}),
		// 	this.signedInUser
		// ]

	}
	
	render() {
		return (
			<Provider store={store} >
				<NavigatorIOS
				style={styles.container}
				initialRoute={{
				 title: `Games`,
				 component: GamesIndex,
				  passProps: {}
				}}/>
			</Provider>
		);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('Catalan', () => Catalan);
