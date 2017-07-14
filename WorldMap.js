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
	
	
	
	
	calculateUnitsForUser( user ) {		
		user.setState({
			nDeployedSettlements: this.nodes.filter((n) => n.state.contents == 1 && n.state.ownedByUser == user).length, 
			nDeployedCities: this.nodes.filter((n) => n.state.contents == 2 && n.state.ownedByUser == user).length, 
			nDeployedRoads: this.edges.filter((n) => n.state).length
		}) 
	}

	userById( userId ) {
		let players = this.context.store.getState().game.players
		return players.filter((p) => p.id == userId)[0] || players[0]
	}
	
	render() {
		
		let hexagonContents = this.context.store.getState().map.hexagonContents
		let nodeContents = this.context.store.getState().map.nodeContents
		let edgeContents = this.context.store.getState().map.edgeContents
		
		
		return(
			<View style={{ backgroundColor: "lightblue", flexDirection: "row"  }}>
				<View style={{flex: 1 }}></View>

				<View style={{flex: 1, marginTop: MapHeight / 2, height: MapHeight / 2 }} >
					<View transform={[{scaleX: 0.3}, {scaleY: 0.3}]} style={{ position: "absolute"}}>

					{ Globals.hexagons.map((e) => 
						<Hexagon key={`hex_${e.index}`} 
							highlight={ this.props.highlightNumber == hexagonContents[e.index].number }
							{...e}
							{...hexagonContents[e.index]}
							{...this.siblingRefFunctions} />
					)}

					{ Globals.edges.map((h) => 
						<Edge key={`edge_${h.index}`} 
							owner={ edgeContents[h.index] ? this.userById(  edgeContents[h.index].userId ) : undefined}
							{...h} 
							{ ...edgeContents[h.index] }
							{...this.siblingRefFunctions} />)}

					{ Globals.nodes.map((h) => 
						<Node key={ h.index } { ...h } { ...nodeContents[h.index] } 
							owner={nodeContents[h.index] ? this.userById( nodeContents[h.index].userId ) : undefined}
							onPress={ this.props ? this.props.onPressNode : () => {} }
							{...this.siblingRefFunctions} /> )}			

					</View>
				</View>
			</View>
		)
		}
}

WorldMap.contextTypes = {
	store: React.PropTypes.object
}


module.exports = WorldMap;