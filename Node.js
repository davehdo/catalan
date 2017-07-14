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

const nodeDiameter = 30


class Node extends Component{
	constructor(props) {
		super(props);
// userId
// buildingType
		
		// this.state = {
		// 	contents: this.props.buildingType, // 1 is a settlement and 2 is a city
		// 	ownedByUser: this.props.userId
		// }
		// index will be like 061 or -061
		// 061 -> should be separated to 06 and 1
		// -061 -> should be separated to -06 and 1
		// this.indexSign = this.props.index > 0 ? 1 : -1
		// this.indexTens = this.indexSign * Math.floor( Math.abs(this.props.index) / 10.0)
		// this.indexOnes = Math.abs(this.props.index) % 10.0
		//
		// this.rotation = {
		// 	0: 90,
		// 	1: 30,
		// }[ this.indexOnes ]
		//
		
		this.coordinates = {x: this.props.x, y: this.props.y} || {x: 0, y: 0}
		
		
		this.styles = {
			circle: {
				position: "absolute",
				width: nodeDiameter,
				height: nodeDiameter,
				borderRadius: nodeDiameter / 2.0,
				backgroundColor: 'brown',
				left:  -nodeDiameter / 2,
				top: -nodeDiameter / 2,
				
			}
		}
	}
	
	get adjacentNodes() {
		return this.props.nodesWithinRadius( this, 1 / Math.sqrt( 3 ) )
	}
	
	get adjacentHexagons() {
		return this.props.hexagonsWithinRadius( this, 1 / Math.sqrt( 3 ) )
	}
	
	get adjacentEdges() {
		return this.props.edgesWithinRadius( this, 0.5 / Math.sqrt( 3 ) )
	}
	
	
	displayContents() {
		switch( this.props.buildingType ) {
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
	
	
	
	shape() {
		let color = this.props.owner ? this.props.owner.color : "white"
		
		switch( this.props.buildingType ) {
			case 1:
				return <View key={ `n_${this.props.index}` } transform={[
					{translateX: (Globals.hexagonSpacing * this.coordinates.x)},
					{translateY: -(Globals.hexagonSpacing * this.coordinates.y)}
				]} style={styles.settlement}>
				<View style={Object.assign({}, StyleSheet.flatten(styles.settlementHexagonInner), {backgroundColor: color})} />
			        <View style={Object.assign({}, StyleSheet.flatten(styles.settlementHexagonBefore), {borderBottomColor: color})} />
			      </View>
				break;
			case 2:

				return <View key={ `n_${this.props.index}` } transform={[
					{translateX: (Globals.hexagonSpacing * this.coordinates.x)},
					{translateY: -(Globals.hexagonSpacing * this.coordinates.y)}
				]} style={styles.city}>
				        <View style={Object.assign({}, StyleSheet.flatten(styles.cityHexagonInner), {backgroundColor: color})} />
				        <View style={Object.assign({}, StyleSheet.flatten(styles.cityHexagonBefore), {borderBottomColor: color})} />
				      </View>

				
				break;
			default:
				return <View key={ `n_${this.props.index}` } transform={[
					{translateX: (Globals.hexagonSpacing * this.coordinates.x)},
					{translateY: -(Globals.hexagonSpacing * this.coordinates.y)}
				]} style={this.styles.circle} />
				
		}
	}
	
	
	render() {
		
		return (
			<TouchableOpacity key={`node_${ this.props.index }`} onPress={ this.props.onPress }>
				{ this.shape() }
			</TouchableOpacity>
		)
	}
}

const settlementWidth = 55
const cityWidth = 80

const styles = StyleSheet.create({
   settlement: {
	  position: "absolute",
		left: -50 / 100 * settlementWidth,
		top: -25 / 100 * settlementWidth,
     width: 100 / 100 * settlementWidth,
     height: 55 / 100 * settlementWidth
   },
   settlementHexagonInner: {
     width: 100 / 100 * settlementWidth,
     height: 55 / 100 * settlementWidth,
     backgroundColor: `red`
   },
   settlementHexagonBefore: {
     position: 'absolute',
     top: -35 / 100 * settlementWidth,
     left: 0,
     width: 0,
     height: 0,
     borderStyle: 'solid',
     borderLeftWidth: 50 / 100 * settlementWidth,
     borderLeftColor: 'transparent',
     borderRightWidth: 50 / 100 * settlementWidth,
     borderRightColor: 'transparent',
     borderBottomWidth: 35 / 100 * settlementWidth,
     borderBottomColor: 'red'
   },
	
   city: {
	  position: "absolute",
		left: -50 / 100 * cityWidth,
		top: -25 / 100 * cityWidth,
     width: 100 / 100 * cityWidth,
     height: 45 / 100 * cityWidth
   },
   cityHexagonInner: {
     width: 100 / 100 * cityWidth,
     height: 45 / 100 * cityWidth,
     backgroundColor: 'red'
   },
   cityHexagonBefore: {
     position: 'absolute',
     top: -25 / 100 * cityWidth,
     left: 0,
     width: 0,
     height: 0,
     borderStyle: 'solid',
     borderLeftWidth: 30 / 100 * cityWidth,
     borderLeftColor: 'transparent',
     borderRightWidth: 30 / 100 * cityWidth,
     borderRightColor: 'transparent',
     borderBottomWidth: 25 / 100 * cityWidth,
     borderBottomColor: 'red'
   }
	
});

module.exports = Node;