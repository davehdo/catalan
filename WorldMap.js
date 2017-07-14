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
	}
	
	userById( userId ) {
		let players = this.context.store.getState().game.players
		return players.filter((p) => p.id == userId)[0] 
	}
	
	
	userWithTurn() {
		let state = this.context.store.getState()
		return state.game.players[state.game.turn]
	}
	
	buildRoad( {userId, edgeId} ) {
		this.context.store.dispatch({ type: "BUILD_EDGE", userId, edgeId }) 
		this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId, WOOD: -1, BRICK: -1})
	}

	buildNode( {userId, nodeId} ) {
		this.context.store.dispatch({ type: "BUILD_NODE", userId, nodeId })
		this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId, WOOD: -1, BRICK: -1, SHEEP: -1, WHEAT: -1})
	}
	
	render() {
		let state = this.context.store.getState()
		let hexagonContents = state.map.hexagonContents
		let nodeContents = state.map.nodeContents
		let edgeContents = state.map.edgeContents
		//this.props ? this.props.onPressNode : () => {} 
		return(
			<View style={{ backgroundColor: "lightblue", flexDirection: "row"  }}>
				<View style={{flex: 1 }}></View>

				<View style={{flex: 1, marginTop: MapHeight / 2, height: MapHeight / 2 }} >
					<View transform={[{scaleX: 0.3}, {scaleY: 0.3}]} style={{ position: "absolute"}}>

					{ Globals.hexagons.map((e) => 
						<Hexagon key={`hex_${e.index}`} 
							highlight={ this.props.highlightNumber == hexagonContents[e.index].number }
							{...e}
							{...hexagonContents[e.index]} />
					)}

					{ Globals.edges.map((h) => 
						<Edge key={`edge_${h.index}`} 
							owner={ edgeContents[h.index] ? this.userById( edgeContents[h.index].userId ) : undefined}
							{...h} 
							{ ...edgeContents[h.index] }
							onPress={ () => this.buildRoad({userId: this.userWithTurn().id, edgeId: h.index }) }/>)}

					{ Globals.nodes.map((h) => 
						<Node key={ h.index } { ...h } { ...nodeContents[h.index] } 
							owner={nodeContents[h.index] ? this.userById( nodeContents[h.index].userId ) : undefined}
							onPress={ () => this.buildNode({userId: this.userWithTurn().id, nodeId: h.index })}  /> )}			

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