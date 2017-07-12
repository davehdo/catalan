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
		// props include highlightNumber and onPressNode
		
		this.state = {
			highlightNumber: props.highlightNumber
		}
		
		// by convention, map is flat on top
		// numbering is outside-in with a spiral
		// starting top row, left most hexagon, and moving clockwise
		let numbers = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11]
		let resources = this.shuffle(Globals.resourceDeck) //.sort((r)=> r ? Math.random() : 0)
		let num
		
		this.hexagons = []
		
		this.hexagonAttributes = resources.map((r,i) => {
			return {index: i, 
				number: num = (r == Globals.resources.DESERT) ? undefined : numbers.shift(), 
				resource: r}  // 19
		})
		
		// ==========================  produce the edges  ==========================
		this.edges = []
		
		this.edgeAttributes = []
		
		this.hexagonAttributes.map((h) => {
			this.edgeAttributes.push({index: h.index * 10})
			this.edgeAttributes.push({index: h.index * 10 + 1})
			this.edgeAttributes.push({index: h.index * 10 + 2})
		})

		let edgesA = [-1, -2, -16, -17, -18]
		edgesA.map((n) => { this.edgeAttributes.push({index: n * 10 - 2}) })

		let edgesB = [-1, -2, -3, -4, -5]
		edgesB.map((n) => { this.edgeAttributes.push({index: n * 10 - 1}) })

		let edgesC = [-4, -5, -6, -7, -8]
		edgesC.map((n) => { this.edgeAttributes.push({index: n * 10 }) })

		// ==========================  produce the nodes  ==========================
		this.nodes = []
			
		this.nodeAttributes = []
		
		this.hexagonAttributes.map((h) => {
			this.nodeAttributes.push( {index: h.index * 10 } )
			this.nodeAttributes.push( {index: h.index * 10 + 1 } )
		})				

		let a = [-4, -5, -6, -7, -8, -9, -10, -11]
		a.map((n) => { this.nodeAttributes.push({ index: n * 10}) })

		let b = [-1, -2, -3, -4, -5, -6, -7, -8]
		b.map((n) => { this.nodeAttributes.push({index: n * 10 - 1}) })

	}
	
	
	nodesWithinRadius(refObj, expectedDistance ) {
		return this.nodes.filter( (n2) => {
			if (n2) {
				let d_sq = (refObj.coordinates.x - n2.coordinates.x ) ** 2 + (refObj.coordinates.y - n2.coordinates.y) ** 2
				return (d_sq < ( expectedDistance + 0.1 ) ** 2) && (d_sq > (expectedDistance - 0.1) ** 2)					
			} else {
				return false
			}
			 
		})
	}
	
	edgesWithinRadius(refObj, expectedDistance ) {
		return this.edges.filter( (n2) => {
			if (n2) {				
				let d_sq = (refObj.coordinates.x - n2.coordinates.x ) ** 2 + (refObj.coordinates.y - n2.coordinates.y) ** 2
				return (d_sq < ( expectedDistance + 0.1 ) ** 2) && (d_sq > (expectedDistance - 0.1) ** 2)	
			} else {
				return false
			}
		})
	}
	
	hexagonsWithinRadius(refObj, expectedDistance ) {
		return this.hexagons.filter( (n2) => {
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
		
		return(
			<View style={{ backgroundColor: "lightblue", flexDirection: "row"  }}>
				<View style={{flex: 1 }}></View>

				<View style={{flex: 1, marginTop: MapHeight / 2, height: MapHeight / 2 }} >
					<View transform={[{scaleX: 0.3}, {scaleY: 0.3}]} style={{ position: "absolute"}}>
						{this.hexagonAttributes.map( (attr) => 
							<Hexagon key={`hexagon_${attr.index}`} 
								ref={(e) => { this.hexagons.push(e) }}
								highlight={ this.state.highlightNumber == attr.number }
								nodesWithinRadius={ (x,r) => this.nodesWithinRadius(x,r) }
								edgesWithinRadius={ (x,r) => this.edgesWithinRadius(x,r) }
								hexagonsWithinRadius={ (x,r) => this.hexagonsWithinRadius(x,r) }
								{...attr} />)}
						
						{this.edgeAttributes.map((attr) => 
							<Edge key={`edge_${attr.index}`} 
								ref={(e) => { this.edges.push(e) }}
								nodesWithinRadius={ (x,r) => this.nodesWithinRadius(x,r) }
								edgesWithinRadius={ (x,r) => this.edgesWithinRadius(x,r) }
								hexagonsWithinRadius={ (x,r) => this.hexagonsWithinRadius(x,r) }
								{...attr} />)}

						{this.nodeAttributes.map((h) => 
							<Node key={ h.index } 
								ref={(e) => { this.nodes.push(e) }} 
								nodesWithinRadius={ (x,r) => this.nodesWithinRadius(x,r) }
								edgesWithinRadius={ (x,r) => this.edgesWithinRadius(x,r) }
								hexagonsWithinRadius={ (x,r) => this.hexagonsWithinRadius(x,r) }
								onPress={  this.props.onPressNode }
								{...h}
							/>
						)}

					</View>
				</View>
			</View>
		)
		}
}



module.exports = WorldMap;