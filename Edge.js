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


const edgeThickness = 14


class Edge extends Component{
	constructor(props) {
		super(props);
		this.index = props.index
		this.contents = undefined
		
		
		this.indexSign = this.index > 0 ? 1 : -1
		this.indexTens = this.indexSign * Math.floor( Math.abs(this.index) / 10.0)
		this.indexOnes = Math.abs(this.index) % 10.0
		
		let center = Globals.hexagonCoordinates[this.indexTens ] || {x: 0, y: 0}
		
		this.coordinates =  {x: center.x, y: center.y }
		this.rotation = {
			0: 60,
			1: 0,
			2: -60
		}[ this.indexOnes ]
		
		this.coordinates.x +=  0.5 * Math.cos( this.rotation / 180 * 3.14159265359 )
		this.coordinates.y +=  0.5 * Math.sin( this.rotation / 180 * 3.14159265359 )
		
		
		this.styles = {rectangle: {
			backgroundColor: "brown",
			width: edgeThickness,
			height: Globals.hexagonSpacing * 0.51,
			position: "absolute",
			left: -edgeThickness * 0.5 + this.coordinates.x * Globals.hexagonSpacing,
			top: -Globals.hexagonSpacing * 0.25 - this.coordinates.y * Globals.hexagonSpacing,			
		}}
		
	}
	
	render() {
		return (
			 <TouchableOpacity key={`edge_${ this.index }`} >
				<View transform={[{ rotate: `${-this.rotation }deg`} ]} 
				style={this.styles.rectangle} />
			</TouchableOpacity>
		)
	}
}


module.exports = Edge;
