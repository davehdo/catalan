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
		// props include 
		// highlightNumber and
		// onPressNode
		
		// by convention, map is flat on top
		// numbering is outside-in with a spiral
		// starting top row, left most hexagon, and moving clockwise
		let numbers = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11]
		let resources = this.shuffle(Globals.resourceDeck) //.sort((r)=> r ? Math.random() : 0)

		this.state = {
			highlightNumber: props ? props.highlightNumber : undefined,
			hexagonProperties: resources.map((r,i) => { 
				return({ 
					index: i, 
					resource: r,
					number: num = (r == Globals.resources.DESERT) ? undefined : numbers.shift(), 
				})
			}),
			nodeContents: {},
			edgeContents: {}
		}
		
		
		// ==========================  produce the hexagon objects  ==========================
		// goal is that whats above this point contains enough information to completely 
		// configure the entire map, and everything below is simply for drawing
		
		let num
		
		this.siblingRefFunctions = {
			nodesWithinRadius: (h,r) => this.nodesWithinRadius(h,r),
			edgesWithinRadius: (h,r) => this.edgesWithinRadius(h,r),
			hexagonsWithinRadius: (h,r) => this.hexagonsWithinRadius(h,r)				
		}
	}
	
	
	nodesWithinRadius(refObj, expectedDistance ) {
		return [].filter( (n2) => {
			if (n2) {
				let d_sq = (refObj.coordinates.x - n2.coordinates.x ) ** 2 + (refObj.coordinates.y - n2.coordinates.y) ** 2
				return (d_sq < ( expectedDistance + 0.1 ) ** 2) && (d_sq > (expectedDistance - 0.1) ** 2)					
			} else {
				return false
			}
			 
		})
	}
	
	edgesWithinRadius(refObj, expectedDistance ) {
		return [].filter( (n2) => {
			if (n2) {				
				let d_sq = (refObj.coordinates.x - n2.coordinates.x ) ** 2 + (refObj.coordinates.y - n2.coordinates.y) ** 2
				return (d_sq < ( expectedDistance + 0.1 ) ** 2) && (d_sq > (expectedDistance - 0.1) ** 2)	
			} else {
				return false
			}
		})
	}
	
	hexagonsWithinRadius(refObj, expectedDistance ) {
		return [].filter( (n2) => {
			if (n2) {				
				let d_sq = (refObj.coordinates.x - n2.coordinates.x ) ** 2 + (refObj.coordinates.y - n2.coordinates.y) ** 2
				return (d_sq < ( expectedDistance + 0.1 ) ** 2) && (d_sq > (expectedDistance - 0.1) ** 2)	
			} else {
				return false 
			}
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
		let edgeIds = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 
			150, 160, 170, 180, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 111, 121, 
			131, 141, 151, 161, 171, 181, 2, 12, 22, 32, 42, 52, 62, 72, 82, 92, 102, 
			112, 122, 132, 142, 152, 162, 172, 182,   -40, -50, -60, -70, -80,
			-11, -21, -31, -41, -51,   -12, -22, -162, -172, -182]
			

		// ==========================  produce the nodes  ==========================
		
		let nodeIds = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 
			150, 160, 170, 180, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 111, 121, 
			131, 141, 151, 161, 171, 181,   -40, -50, -60, -70, -80, -90, -100, -110, 
			-11, -21, -31, -41, -51, -61, -71, -81]
		
		
		return(
			<View style={{ backgroundColor: "lightblue", flexDirection: "row"  }}>
				<View style={{flex: 1 }}></View>

				<View style={{flex: 1, marginTop: MapHeight / 2, height: MapHeight / 2 }} >
					<View transform={[{scaleX: 0.3}, {scaleY: 0.3}]} style={{ position: "absolute"}}>

					{ this.state.hexagonProperties.map((e) => 
						<Hexagon key={`hex_${e.index}`} 
							highlight={ this.state.highlightNumber == e.number }
							{...e}
							{...this.siblingRefFunctions} />
					)}

					{ edgeIds.map((h) => 
						<Edge key={`edge_${h}`}
							index={h}
							{...this.siblingRefFunctions} />)}

					{ nodeIds.map((h) => 
						<Node key={ h } index={ h }
							onPress={ this.props ? this.props.onPressNode : () => {} }
							{...this.siblingRefFunctions} /> )}			

					</View>
				</View>
			</View>
		)
		}
}



module.exports = WorldMap;