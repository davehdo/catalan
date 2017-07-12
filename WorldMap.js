'use strict';


import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
	TouchableOpacity
} from 'react-native';

const Node = require("./Node.js")
const Edge = require("./Edge.js")
const Hexagon = require("./Hexagon.js")
const Globals = require("./Globals.js")

const MapHeight = 310


class WorldMap extends Component {
		
	constructor(props) {
		super(props);
		// props include turnOfUser and navigator and highlightNumber
		
		this.state = {
			highlightNumber: props.highlightNumber
		}
		
		// by convention, map is flat on top
		// numbering is outside-in with a spiral
		// starting top row, left most hexagon, and moving clockwise
		let numbers = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11]
		let resources = this.shuffle(Globals.resourceDeck) //.sort((r)=> r ? Math.random() : 0)
		let num
		
		this.hexagons = resources.map((r,i) => new Hexagon({index: i, number: num = (r == Globals.resources.DESERT) ? undefined : numbers.shift(), resource: r, parentWorldMap: this}) ) // 19
		
		// ==========================  produce the edges  ==========================
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

		// ==========================  produce the nodes  ==========================
		this.nodes = []
			
						
		this.hexagons.map((h) => {
			this.nodes.push(new Node({navigator: this.props.navigator, onPress: this.props.onPressNode, index: h.index * 10}))
			this.nodes.push(new Node({navigator: this.props.navigator, onPress: this.props.onPressNode, index: h.index * 10 + 1}))
		})
		
		let a = [-4, -5, -6, -7, -8, -9, -10, -11]
		a.map((n) => {
			this.nodes.push(new Node({navigator: this.props.navigator, onPress: this.props.onPressNode, index: n * 10}))
		})

		let b = [-1, -2, -3, -4, -5, -6, -7, -8]
		b.map((n) => {
			this.nodes.push(new Node({navigator: this.props.navigator, onPress: this.props.onPressNode, index: n * 10 - 1}))
		})
		
		
		// ============  associate nodes -> hexagons and nodes -> edges  ============
		this.nodes.map((n) => {
			n.hexagons = this.hexagons.filter( (h) => {
				return (n.coordinates.x - h.coordinates.x ) ** 2 + (n.coordinates.y - h.coordinates.y) ** 2 < ( 0.9 ) ** 2
			}) 
			
			n.edges = this.edges.filter( (h) => {
				return (n.coordinates.x - h.coordinates.x ) ** 2 + (n.coordinates.y - h.coordinates.y) ** 2 < ( 0.5 ) ** 2
			})
			
			n.adjacentNodes = this.nodes.filter( (n2) => {
				let d_sq = (n.coordinates.x - n2.coordinates.x ) ** 2 + (n.coordinates.y - n2.coordinates.y) ** 2
				return (d_sq < ( 0.75 ) ** 2) && (d_sq > 0.1 ** 2)
				
			})
		})
		
		// associate
		this.hexagons.map((h) => {
			h.nodes = this.nodes.filter( (n) => {
				return (n.coordinates.x - h.coordinates.x ) ** 2 + (n.coordinates.y - h.coordinates.y) ** 2 < ( 0.9 ) ** 2
			})
		})
				
	}
	
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
	
	calculateUnitsForUser( user ) {		
		user.setState({
			nDeployedSettlements: this.nodes.filter((n) => n.state.contents == 1 && n.state.ownedByUser == user).length, 
			nDeployedCities: this.nodes.filter((n) => n.state.contents == 2 && n.state.ownedByUser == user).length, 
			nDeployedRoads: this.edges.filter((n) => n.state).length
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