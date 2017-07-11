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


const WHEAT = Symbol("WHEAT");
const SHEEP = Symbol("SHEEP");
const LUMBER = Symbol("LUMBER");
const BRICK = Symbol("BRICK");
const ORE = Symbol("ORE");
const DESERT = Symbol("DESERT");

const MapHeight = 340
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
		
class Hexagon extends Component {
	constructor(props) {
		super(props);
		this.number = props.number
		this.resource = props.resource
		this.index = props.index
		
		this.coordinates = hexagonCoordinates[ this.index ] || {x: 0, y: 0}
		
		this.width = hexagonSpacing 
		
		this.styles = {
			hexagon: { // the top of this obj is actually the top of the rectangular component of the hexagon
				width: this.width,
				height: 1.07 * this.width / Math.sqrt(3),
				left: -this.width / 2 + (this.coordinates ? (hexagonSpacing * this.coordinates.x) : 0 ),
				top: -(this.width / Math.sqrt(3)) / 2 - (this.coordinates ? (hexagonSpacing * this.coordinates.y) : 0),
				position: "absolute",
				justifyContent: "center", 
				alignItems: "center"
			},
			hexagonInner: {
				width: this.width,
				height: 1.07 * this.width / Math.sqrt(3),
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
				<Text style={{ backgroundColor: "transparent", fontSize: 40}}>{ this.number }</Text>
			 </View>
	      </View>
	    )
	  }
	  
}


class WorldMap extends Component {
	shuffle(array) {
	    let counter = array.length;

	    // While there are elements in the array
	    while (counter > 0) {
	        // Pick a random index
	        let index = Math.floor(Math.random() * counter);

	        // Decrease counter by 1
	        counter--;

	        // And swap the last element with it
	        let temp = array[counter];
	        array[counter] = array[index];
	        array[index] = temp;
	    }

	    return array;
	}
	
	constructor(props) {
		super(props);
		// by convention, flat on top
		// numbering is outside-in with a spiral
		// starting top row, left most hexagon, and moving clockwise
		let numbers = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11]
		let resources = this.shuffle([DESERT, WHEAT, WHEAT, WHEAT, WHEAT, SHEEP, SHEEP, SHEEP, SHEEP, LUMBER, LUMBER, LUMBER, LUMBER, BRICK, BRICK, BRICK, ORE, ORE, ORE ]) //.sort((r)=> r ? Math.random() : 0)

		this.hexagons = resources.map((r,i) => new Hexagon({index: i, number: r == DESERT ? undefined : numbers.shift(), resource: r}) ) // 19
		
		// produce the edges
		this.edges = []
		
		this.hexagons.map((h) => {

			this.edges.push(new Edge({index: h.index * 10}))
			this.edges.push(new Edge({index: h.index * 10 + 1}))
			this.edges.push(new Edge({index: h.index * 10 + 2}))
			
		})

		let edgesA = [-1, -2, -16, -17, -18]
		edgesA.map((n) => {
			this.edges.push(new Edge({index: n * 10 - 2}))
		})

		let edgesB = [-1, -2, -3, -4, -5]
		edgesB.map((n) => {
			this.edges.push(new Edge({index: n * 10 - 1}))
		})

		let edgesC = [-4, -5, -6, -7, -8]
		edgesC.map((n) => {
			this.edges.push(new Edge({index: n * 10 }))
		})

		
		this.nodes = []
			
		this.hexagons.map((h) => {
			this.nodes.push(new Node({navigator: this.props.navigator, index: h.index * 10}))
			this.nodes.push(new Node({navigator: this.props.navigator, index: h.index * 10 + 1}))
		})
		
		let a = [-4, -5, -6, -7, -8, -9, -10, -11]
		a.map((n) => {
			this.nodes.push(new Node({navigator: this.props.navigator, index: n * 10}))
		})

		let b = [-1, -2, -3, -4, -5, -6, -7, -8]
		b.map((n) => {
			this.nodes.push(new Node({navigator: this.props.navigator, index: n * 10 - 1}))
		})
		
		// associate nodes -> hexagons and nodes -> edges
		this.nodes.map((n) => {
			n.hexagons = this.hexagons.filter( (h) => {
				return (n.coordinates.x - h.coordinates.x ) ** 2 + (n.coordinates.y - h.coordinates.y) ** 2 < ( 0.9 ) ** 2
			}) 
			
			n.edges = this.edges.filter( (h) => {
				return (n.coordinates.x - h.coordinates.x ) ** 2 + (n.coordinates.y - h.coordinates.y) ** 2 < ( 0.5 ) ** 2
			})
		})
				
	}

	render() {
		
		return(
			<View style={{ backgroundColor: "lightblue", flexDirection: "row"  }}>
				<View style={{flex: 1 }}></View>

				<View style={{flex: 1, marginTop: MapHeight / 2, height: MapHeight / 2 }} >
					<View transform={[{scaleX: 0.3}, {scaleY: 0.3}]} style={{ position: "absolute"}}>
						{this.hexagons.map((h) => h.render())}
						{this.edges.map((n) => n.render())}
						{this.nodes.map((n) => n.render())}
					</View>
				</View>
			</View>
		)
		}
	

}



module.exports = WorldMap;