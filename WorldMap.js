'use strict';


import React, { Component } from 'react';
import {
  // AppRegistry,
  // StyleSheet,
  Text,
  View,
	// TouchableOpacity
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
	

	
	render() {
		// let state = this.context.store.getState()
		let hexagonContents = this.props.map.hexagonContents
		let nodeContents = this.props.map.nodeContents
		let edgeContents = this.props.map.edgeContents
		//this.props ? this.props.onPressNode : () => {} 
		return(
			<View style={{ backgroundColor: "lightblue", flexDirection: "row"  }}>
				<View style={{flex: 1}}></View>

				<View style={{flex: 1, marginTop: MapHeight / 2, height: MapHeight / 2 }} >
					<View transform={[{scaleX: 0.3}, {scaleY: 0.3}]} style={{ position: "absolute"}}>

					{ Globals.hexagons.map((e) => 
						<Hexagon key={`hex_${e.index}`} 
							highlight={ this.props.highlightNumber == hexagonContents[e.index].number }
							onPress={ () => this.props.onPressHexagon(e.index) }
							{...e}
							{...hexagonContents[e.index]} />
					)}

					{ Globals.edges.map((h) => 
						<Edge key={`edge_${h.index}`} 
							owner={ edgeContents[h.index] ? this.props.userById( edgeContents[h.index].userId ) : undefined}
							{...h} 
							{ ...edgeContents[h.index] }
							onPress={ () => this.props.onPressEdge( h.index )} />)}

					{ Globals.nodes.map((h) => 
						<Node key={ h.index } { ...h } { ...nodeContents[h.index] } 
							owner={nodeContents[h.index] ? this.props.userById( nodeContents[h.index].userId ) : undefined}
							onPress={ () => this.props.onPressNode( h.index )} /> )}			

					</View>
				</View>
			</View>
		)
		}
}



module.exports = WorldMap;