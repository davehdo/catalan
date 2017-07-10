'use strict';


import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

const WHEAT = Symbol("WHEAT");
const SHEEP = Symbol("SHEEP");
const LUMBER = Symbol("LUMBER");
const BRICK = Symbol("BRICK");
const ORE = Symbol("ORE");
const DESERT = Symbol("DESERT");

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
		"-8": {x: 0.499999999999999, y: -2.59807621135332}
	}
		
class Hexagon extends Component {
	constructor(props) {
		super(props);
		this.number = props.number
		this.resource = props.resource
		this.index = props.index
		
		this.coordinates = hexagonCoordinates[ this.index ]
		
		this.width = 60 
		this.spacing = 65
		
		this.styles = {
			hexagon: {
				width: 100 * this.width / 100,
				height: 55 * this.width / 100,
				left: 0 + (this.coordinates ? (this.spacing * this.coordinates.x) : 0 ),
				top: 0 - (this.coordinates ? (this.spacing * this.coordinates.y) : 0),
				position: "absolute",
				justifyContent: "center", 
				alignItems: "center"
			},
			hexagonInner: {
				width: 100 * this.width / 100,
				height: 55 * this.width / 100,
				backgroundColor: this.color()
			},
			hexagonAfter: {
				position: 'absolute',
				bottom: -25 * this.width / 100,
				left: 0,
				width: 0,
				height: 0,
				borderStyle: 'solid',
				borderLeftWidth: 50 * this.width / 100,
				borderLeftColor: 'transparent',
				borderRightWidth: 50 * this.width / 100,
				borderRightColor: 'transparent',
				borderTopWidth: 25 * this.width / 100,
				borderTopColor: this.color()
			},
			hexagonBefore: {
				position: 'absolute',
				top: -25 * this.width / 100,
				left: 0,
				width: 0,
				height: 0,
				borderStyle: 'solid',
				borderLeftWidth: 50 * this.width / 100,
				borderLeftColor: 'transparent',
				borderRightWidth: 50 * this.width / 100,
				borderRightColor: 'transparent',
				borderBottomWidth: 25 * this.width / 100,
				borderBottomColor: this.color()
			}
		}
	}
	
	displayName() {
		let r = undefined
		switch( this.resource ) {
		case WHEAT:
			r = "W"
			break;
		case SHEEP:
			r = "S"
			break;
		case LUMBER:
			r = "L"
			break;
		case BRICK:
			r = "B"
			break;
		case ORE:
			r = "O"
			break;
		case DESERT:
			r = "D"
			break;
		default:
			r = undefined
			
		}
		return `${ r }${ this.number || "" }`
	}
	
	color() {
		let r = undefined
		switch( this.resource ) {
		case WHEAT:
			r = "gold"
			break;
		case SHEEP:
			r = "lightgreen"
			break;
		case LUMBER:
			r = "forestgreen"
			break;
		case BRICK:
			r = "darkred"
			break;
		case ORE:
			r = "silver"
			break;
		case DESERT:
			r = "whitesmoke"
			break;
		default:
			r = undefined
			
		}
		return r
	}
	
	
	render() {
	    return (
	      <View key={ `hex${this.index}` } style={this.styles.hexagon}>
				<View style={this.styles.hexagonInner} />
				<View style={this.styles.hexagonBefore} />
				<View style={this.styles.hexagonAfter} />
			 <View style={{ position: "absolute"}}>
				<Text style={{ backgroundColor: "transparent"}}>{ this.number }</Text>
			 </View>
	      </View>
	    )
	  }
	  
}

class Edge {
	constructor(props) {
		this.number = props.number
		this.contents = undefined
	}
}

class Node extends Component{
	constructor(props) {
		super(props);
		this.index = props.index
		this.contents = undefined
		
		this.spacing = 75
		
		
		let center = hexagonCoordinates[ Math.floor(this.index / 10.0) ] || {x: 0, y: 0}
		let adjust = {
			0: {x: 0, y: this.spacing / 2},
			1: {x: 0.866025404 * this.spacing, y: 0.5 * this.spacing},
			// 2: {x: 0.866025404 * this.spacing, y: -0.5 * this.spacing}
		}[ this.index % 10 ] || {x: 0, y: 0}
		
		this.coordinates =  {x: center.x + adjust.x, y: center.y + adjust.y}
		
		
		this.styles = {
			circle: {
				position: "absolute",
				width: 1000,
				height: 1000,
				// borderRadius: 100 / 2.0,
				backgroundColor: 'red',
				left: Math.random() * 100, // 0 + (this.coordinates ? (this.spacing * this.coordinates.x) : 0 ),
				top: Math.random() * 100, //0 - (this.coordinates ? (this.spacing * this.coordinates.y) : 0),
				
			}
		}
	}
	
	render() {
		return (
			 <View key={`node${ this.index }`} style={styles.circle} >
			<Text>Hi</Text>
			</View>
		)
	}
}

class WorldMap extends Component {
	constructor(props) {
		super(props);
		// by convention, flat on top
		// numbering is outside-in with a spiral
		// starting top row, left most hexagon, and moving clockwise
		let numbers = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11]
		let resources = [DESERT, WHEAT, WHEAT, WHEAT, WHEAT, SHEEP, SHEEP, SHEEP, SHEEP, LUMBER, LUMBER, LUMBER, LUMBER, BRICK, BRICK, BRICK, ORE, ORE, ORE ] //.sort((r)=> r ? Math.random() : 0)

		this.hexagons = resources.map((r,i) => new Hexagon({index: i, number: r == DESERT ? undefined : numbers.shift(), resource: r}) ) // 19
		
		// produce the edges
		// this.edges = []
		
		// this.hexagons.map((h) => {
		//
		// 	h.edges = [
		// 		new Edge({number: h.number * 10}),
		// 		new Edge({number: h.number * 10 + 1}),
		// 		new Edge({number: h.number * 10 + 2})
		// 	]
		//
		// 	this.edges << h.edges
		// })
		//
		// [-1, -2, -16, -17, -18].map((n) => {
		// 	this.edges << new Edge({number: n * 10 + 2})
		// })
		//
		// [-1, -2, -3, -4, -5].map((n) => {
		// 	this.edges << new Edge({number: n * 10 + 1})
		// })
		//
		// [-4, -5, -6, -7, -8].map((n) => {
		// 	this.edges << new Edge({number: n * 10 })
		// })
		this.nodes = []
			
		this.hexagons.map((h) => {

			this.nodes << new Node({index: h.number * 10})
			this.hodes << new Node({index: h.number * 10 + 1})
		})
	}

	render() { 
		return( 
			<View style={{ marginTop: 200, marginLeft: -60}}>
			{this.nodes.map((n) => n.render())}
			{this.hexagons.map((h) => h.render())}
			</View>
		)
		}
	

}



module.exports = WorldMap;