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
		
		this.coordinates = hexagonCoordinates[ this.index ]
		
		this.width = 65 
		this.spacing = 65
		
		this.styles = {
			hexagon: { // the top of this obj is actually the top of the rectangular component of the hexagon
				width: 100 * this.width / 100,
				height: 55 * this.width / 100,
				left: -this.width / 2 + (this.coordinates ? (this.spacing * this.coordinates.x) : 0 ),
				top: -( 55 / 100 * this.width) / 2 - (this.coordinates ? (this.spacing * this.coordinates.y) : 0),
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

class Edge extends Component{
	constructor(props) {
		super(props);
		this.index = props.index
		this.contents = undefined
		
		this.spacing = 65
		this.thickness = 6
		this.indexSign = this.index > 0 ? 1 : -1
		this.indexTens = this.indexSign * Math.floor( Math.abs(this.index) / 10.0)
		this.indexOnes = Math.abs(this.index) % 10.0
		
		let center = hexagonCoordinates[this.indexTens ] || {x: 0, y: 0}
		
		this.coordinates =  {x: center.x, y: center.y }
		
		this.rotation = {
			0: -60,
			1: 0,
			2: 60
		}[ this.indexOnes ]
		
		this.styles = {rectangle: {
			backgroundColor: "red",
			width: this.thickness,
			height: this.spacing * 0.5,
			position: "absolute",
			left: -this.thickness * 0.5 + this.coordinates.x * this.spacing ,
			top: -this.spacing * 0.25 - this.coordinates.y * this.spacing ,			
		}}
		
	}
	
	render() {
		return (
			 <View key={`edge_${ this.index }`} transform={[{ rotate: `${ this.rotation }deg`}, {translateX: this.spacing / 2}]} style={this.styles.rectangle} />
		)
	}
}


class Node extends Component{
	constructor(props) {
		super(props);
		this.index = props.index
		this.contents = undefined
		this.diameter = 10
		this.spacing = 65
		
		// index will be like 061 or -061
		// 061 -> should be separated to 06 and 1
		// -061 -> should be separated to -06 and 1
		this.indexSign = this.index > 0 ? 1 : -1
		this.indexTens = this.indexSign * Math.floor( Math.abs(this.index) / 10.0)
		this.indexOnes = Math.abs(this.index) % 10.0
		
		this.rotation = {
			0: -90,
			1: -30,
		}[ this.indexOnes ]
		
		this.coordinates =  hexagonCoordinates[this.indexTens ] || {x: 0, y: 0}
		
		
		this.styles = {
			circle: {
				position: "absolute",
				width: this.diameter,
				height: this.diameter,
				borderRadius: this.diameter / 2.0,
				backgroundColor: 'green',
				left:  -this.diameter / 2 + (this.spacing * this.coordinates.x) ,
				top: -this.diameter / 2 - (this.spacing * this.coordinates.y),
				
			}
		}
	}
	
	render() {
		return (
			 <View key={`node${ this.index }`} transform={[{ rotate: `${ this.rotation }deg`}, {translateX: this.spacing / Math.sqrt(3)}]}  style={this.styles.circle} />
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
			this.nodes.push(new Node({index: h.index * 10}))
			this.nodes.push(new Node({index: h.index * 10 + 1}))
		})
		
		let a = [-4, -5, -6, -7, -8, -9, -10, -11]
		a.map((n) => {
			this.nodes.push(new Node({index: n * 10}))
		})

		let b = [-1, -2, -3, -4, -5, -6, -7, -8]
		b.map((n) => {
			this.nodes.push(new Node({index: n * 10 - 1}))
		})
				
	}

	render() { 
		return( 
			<View style={{ marginTop: 200, marginLeft: 0}} transform={[{ scaleX: 1 }, {scaleY: 1}]}>
				{this.hexagons.map((h) => h.render())}
				{this.edges.map((n) => n.render())}
				{this.nodes.map((n) => n.render())}

			</View>
		)
		}
	

}



module.exports = WorldMap;