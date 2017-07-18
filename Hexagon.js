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

const Globals = require("./Globals.js")

class Hexagon extends Component {
	constructor(props) {
		super(props); // props includes highlight, number, resource, and index

		const expectedProbs = ["x", "y", "index", "adjNodes", "adjEdges"]
		expectedProbs.map((p) => {
			
			if (props[p] == undefined) {
				console.log( `Warning: absent property ${ p }`)
			}
		}
		)
		// console.log(HexNode)
		
		this.coordinates = {x: this.props.x, y: this.props.y} || {x: 0, y: 0}
		
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
	
	
	
	static all({store}) {		
		return Globals.hexagons.map((h) => {
			// h has index, x, y, adjNodes, adjEdges, ...
			return new Hexagon({store, ...h, ...store.getState().map.hexagonContents[h.index]})
		})		
	}
	
	static where({store, idArray=[]}) {
		return this.all({store}).filter((e) => idArray.includes(e.props.index) )
	}
	
	static find({store, id}) {
		return this.all({store}).filter((e) => id == e.props.index )[0]
	}
	
	
	adjacentNodes() {
		const HexNode = require("./HexNode.js")
		return HexNode.where({store: this.props.store, idArray: this.props.adjNodes})
	} 
	
	adjacentEdges() {
		const Edge = require("./Edge.js")
		return Edge.where({store: this.props.store, idArray: this.props.adjEdges})		
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
	
	
	
	render() {
	    return (
		<TouchableOpacity key={`hex_${ this.props.index }`} onPress={ this.props.onPress }>
	      <View  style={this.styles.hexagon}>
				<View style={this.styles.hexagonInner} />
				<View style={this.styles.hexagonBefore} />
				<View style={this.styles.hexagonAfter} />
			 <View style={{ position: "absolute"}}>
				<Text style={ this.props.highlight ? styles.hexNumberLabelHighlighted : styles.hexNumberLabel }>{ this.props.number }</Text>
			 </View>
			 	{ this.props.robber ? <RobberChip /> : <View />}
	      </View>
		</TouchableOpacity>
	    )
	  }
	  
}

const RobberChip = () => {
	return(
		<View style={ styles.robberChip }><Text style={{color: "white", fontSize: 40}}>R</Text></View>
	)
}

const nodeDiameter = 70

let styles = StyleSheet.create({
   hexNumberLabel: { backgroundColor: "transparent", fontSize: 40},
   hexNumberLabelHighlighted: { backgroundColor: "transparent", fontSize: 50, fontWeight: "bold", color: "red"},
	robberChip: {
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		width: nodeDiameter,
		height: nodeDiameter,
		borderRadius: nodeDiameter / 2.0,
		backgroundColor: '#cc0000',
		top:  0,
		left: 10,
	
	},
	
});



module.exports = Hexagon;