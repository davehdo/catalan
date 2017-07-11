'use strict';


import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
	TouchableOpacity
} from 'react-native';


// const NodeShow = require('./NodeShow.js');

const hexagonSpacing = 200
const edgeThickness = 14

const hexagonCoordinates = {
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
	}
		
		
class Edge extends Component{
	constructor(props) {
		super(props);
		this.index = props.index
		this.contents = undefined
		
		
		this.indexSign = this.index > 0 ? 1 : -1
		this.indexTens = this.indexSign * Math.floor( Math.abs(this.index) / 10.0)
		this.indexOnes = Math.abs(this.index) % 10.0
		
		let center = hexagonCoordinates[this.indexTens ] || {x: 0, y: 0}
		
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
			height: hexagonSpacing * 0.51,
			position: "absolute",
			left: -edgeThickness * 0.5 + this.coordinates.x * hexagonSpacing,
			top: -hexagonSpacing * 0.25 - this.coordinates.y * hexagonSpacing,			
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
