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
const Node = require("./Node.js")
const Edge = require("./Edge.js")
const Globals = require("./Globals.js")



class Hexagon extends Component {
	constructor(props) {
		super(props); // props includes highlight, number, resource, and index
		
		this.state = {
			highlight: props.highlight
		}
				
		this.coordinates = Globals.hexagonCoordinates[ this.props.index ] || {x: 0, y: 0}
		
		let sideToSideWidth = Globals.hexagonSpacing 
		
		this.styles = {
			hexagon: { // the top of this obj is actually the top of the rectangular component of the hexagon
				width: sideToSideWidth,
				height: 1.07 * sideToSideWidth / Math.sqrt(3),
				left: -sideToSideWidth / 2 + (this.coordinates ? (Globals.hexagonSpacing * this.coordinates.x) : 0 ),
				top: -(sideToSideWidth / Math.sqrt(3)) / 2 - (this.coordinates ? (Globals.hexagonSpacing * this.coordinates.y) : 0),
				position: "absolute",
				justifyContent: "center", 
				alignItems: "center"
			},
			hexagonInner: {
				width: sideToSideWidth,
				height: 1.07 * sideToSideWidth / Math.sqrt(3),
				backgroundColor: this.color()
			},
			hexagonAfter: {
				position: 'absolute',
				bottom: -25 * sideToSideWidth / 100,
				left: 0,
				width: 0,
				height: 0,
				borderStyle: 'solid',
				borderLeftWidth: 50 * sideToSideWidth / 100,
				borderLeftColor: 'transparent',
				borderRightWidth: 50 * sideToSideWidth / 100,
				borderRightColor: 'transparent',
				borderTopWidth: 25 * sideToSideWidth / 100,
				borderTopColor: this.color()
			},
			hexagonBefore: {
				position: 'absolute',
				top: -25 * sideToSideWidth / 100,
				left: 0,
				width: 0,
				height: 0,
				borderStyle: 'solid',
				borderLeftWidth: 50 * sideToSideWidth / 100,
				borderLeftColor: 'transparent',
				borderRightWidth: 50 * sideToSideWidth / 100,
				borderRightColor: 'transparent',
				borderBottomWidth: 25 * sideToSideWidth / 100,
				borderBottomColor: this.color()
			}
		}
	}
	
	displayName() {
		let r = undefined
		switch( this.props.resource ) {
		case Globals.resources.WHEAT:
			r = "W"
			break;
		case Globals.resources.SHEEP:
			r = "S"
			break;
		case Globals.resources.LUMBER:
			r = "L"
			break;
		case Globals.resources.BRICK:
			r = "B"
			break;
		case Globals.resources.ORE:
			r = "O"
			break;
		case Globals.resources.DESERT:
			r = "D"
			break;
		default:
			r = undefined
			
		}
		return `${ r }${ this.props.number || "" }`
	}
	
	color() {
		let r = undefined
		switch( this.props.resource ) {
		case Globals.resources.WHEAT:
			r = "gold"
			break;
		case Globals.resources.SHEEP:
			r = "lightgreen"
			break;
		case Globals.resources.LUMBER:
			r = "forestgreen"
			break;
		case Globals.resources.BRICK:
			r = "darkred"
			break;
		case Globals.resources.ORE:
			r = "silver"
			break;
		case Globals.resources.DESERT:
			r = "whitesmoke"
			break;
		default:
			r = undefined
			
		}
		return r
	}
	
	get adjacentNodes() {
		return this.props.nodesWithinRadius( this, 1 / Math.sqrt( 3 ) )
	}
	
	// get adjacentHexagons() {
	// 	return this.props.hexagonsWithinRadius( this, 1 / Math.sqrt( 3 ) )
	// }
	
	// get adjacentEdges() {
	// 	return this.props.edgesWithinRadius( this, 0.5 / Math.sqrt( 3 ) )
	// }
	
	render() {
	    return (
	      <View key={ `hex_${this.props.index}` } style={this.styles.hexagon}>
				<View style={this.styles.hexagonInner} />
				<View style={this.styles.hexagonBefore} />
				<View style={this.styles.hexagonAfter} />
			 <View style={{ position: "absolute"}}>
				<Text style={ this.state.highlight ? styles.hexNumberLabelHighlighted : styles.hexNumberLabel }>{ this.props.number }</Text>
			 </View>
	      </View>
	    )
	  }
	  
}



let styles = StyleSheet.create({
   hexNumberLabel: { backgroundColor: "transparent", fontSize: 40},
   hexNumberLabelHighlighted: { backgroundColor: "transparent", fontSize: 50, fontWeight: "bold", color: "red"}
});



module.exports = Hexagon;