'use strict';


import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
	TouchableOpacity
} from 'react-native';


const NodeShow = require('./NodeShow.js');

const nodeDiameter = 30
const hexagonSpacing = 200
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
		



class Node extends Component{
	constructor(props) {
		super(props);

		this.index = props.index
		this.contents = undefined // 1 is a settlement and 2 is a city
		this.ownedByUser = undefined
		
		// index will be like 061 or -061
		// 061 -> should be separated to 06 and 1
		// -061 -> should be separated to -06 and 1
		this.indexSign = this.index > 0 ? 1 : -1
		this.indexTens = this.indexSign * Math.floor( Math.abs(this.index) / 10.0)
		this.indexOnes = Math.abs(this.index) % 10.0
		
		this.rotation = {
			0: 90,
			1: 30,
		}[ this.indexOnes ]
		
		this.coordinates = {
			x: hexagonCoordinates[ this.indexTens ].x || 0, 
			y: hexagonCoordinates[ this.indexTens ].y || 0
		}
		
		this.coordinates.x +=  1 / Math.sqrt(3) * Math.cos( this.rotation / 180 * 3.14159265359 )
		this.coordinates.y +=  1 / Math.sqrt(3) * Math.sin( this.rotation / 180 * 3.14159265359 )
		
		
		this.styles = {
			circle: {
				position: "absolute",
				width: nodeDiameter,
				height: nodeDiameter,
				borderRadius: nodeDiameter / 2.0,
				backgroundColor: 'brown',
				left:  -nodeDiameter / 2 + (hexagonSpacing * this.coordinates.x) ,
				top: -nodeDiameter / 2 - (hexagonSpacing * this.coordinates.y),
				
			}
		}
	}
	
	displayContents() {
		switch( this.contents ) {
			case 1: 
				return "Settlement"
				break;
			case 2:
				return "City"
				break;
			default:
				return "Empty lot"
		}
	}
	render() {
		return (
			<TouchableOpacity key={`node_${ this.index }`} onPress={ () => {
					this.props.navigator.push({
					  title: 'Node',
					  component: NodeShow,
					  passProps: {node: this}
					});
				}}>
				<View //transform={[{ rotate: `${ this.rotation }deg`}, {translateX: hexagonSpacing / Math.sqrt(3)}]}  
					style={this.styles.circle} />
			</TouchableOpacity>
		)
	}
}



module.exports = Node;