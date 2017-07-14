'use strict';


import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
	TouchableOpacity
} from 'react-native';

const Globals = require("./Globals.js")

// const NodeShow = require('./NodeShow.js');


const edgeThickness = 16


class Edge extends Component{
	constructor(props) {
		super(props);
		
		this.coordinates = {x: this.props.x, y: this.props.y} || {x: 0, y: 0}
		
		let indexOnes = Math.abs(this.props.index) % 10.0

		this.rotation = {
			0: 60,
			1: 0,
			2: -60
		}[ indexOnes ]
		
		
	}
	
	render() {
		this.styles = {
			unpaved: {
				backgroundColor: "brown",
				width: edgeThickness,
				height: Globals.hexagonSpacing * 0.51,
				position: "absolute",
				left: -edgeThickness * 0.5 + this.coordinates.x * Globals.hexagonSpacing,
				top: -Globals.hexagonSpacing * 0.25 - this.coordinates.y * Globals.hexagonSpacing,			
			},
			paved: {
				borderColor: "brown", 
				borderWidth: 4, 
			
				backgroundColor: this.props.owner ? this.props.owner.color : "white",
				width: 22,
				height: Globals.hexagonSpacing * 0.51,
				position: "absolute",
				left: -edgeThickness * 0.5 + this.coordinates.x * Globals.hexagonSpacing,
				top: -Globals.hexagonSpacing * 0.25 - this.coordinates.y * Globals.hexagonSpacing,			
			},
		}

		return (
			 <TouchableOpacity key={`edge_${ this.props.index }`} onPress={ this.props.onPress }>
				<View transform={[{ rotate: `${-this.rotation }deg`} ]} 
				style={ this.props.road ? this.styles.paved : this.styles.unpaved } />
			</TouchableOpacity>
		)
	}
}


module.exports = Edge;
