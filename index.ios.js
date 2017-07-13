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
  Text,
  View,
	NavigatorIOS
} from 'react-native';

import { createStore, applyMiddleware, combineReducers, compose} from "redux";
import {Provider} from "react-redux";
import thunkMiddleware from "redux-thunk"
import {createLogger} from "redux-logger"
import {combinedReducer} from "./reducers/index"

const loggerMiddleware = createLogger({ predicte: (getState, action) => __DEV__ })
const configureStore = (initialState) => {
	const enhancer = compose(
		applyMiddleware(
			thunkMiddleware,
			loggerMiddleware
		),
	);
	return createStore(combinedReducer, initialState, enhancer)
}

// store methods are getState, dispatch, and subscribe

const store = configureStore({})
// store.subscripe( render )
const GameHome = require('./GameHome');
const WorldMap = require('./WorldMap');
const User = require('./User.js');



export default class Catalan extends Component {
	constructor() {
		
		super()
		this.signedInUser = new User({name: "House Lannister", color: "red"})
		this.users = [
			new User({name: "House Tyrell", color: "teal"}), 
			new User({name: "House Fray", color: "black"}), 
			this.signedInUser
		]

	}
	
	render() {
		return (
			<Provider store={store}>
				<NavigatorIOS
				style={styles.container}
				initialRoute={{
				 title: 'Catalan',
				 component: GameHome,
				  passProps: {worldMap: new WorldMap(), signedInUser: this.signedInUser, users: this.users}
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
