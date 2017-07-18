'use strict';


import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
	TouchableOpacity
} from 'react-native';

const Globals = require("./Globals.js")


const edgeThickness = 16


class Edge extends Component{
	constructor(props) {
		super(props);
		
		this.coordinates = {x: this.props.x, y: this.props.y} || {x: 0, y: 0}
		
		let indexOnes = Math.abs(this.props.index) % 10.0

		this.rotation = {
			0: 60,
			1: 0,
			2: -60
		}[ indexOnes ]
		
		
	}
	
	// const Hexagon = require("./Hexagon.js")
	
	adjacentNodes() {
		const HexNode = require("./HexNode.js")
		return HexNode.where({store: this.props.store, idArray: this.props.adjNodes})
	} 
	
	adjacentEdges() {
		return Edge.where({store: this.props.store, idArray: this.props.adjEdges})		
	} 
	
	
	static all({store}) {		
		return Globals.edges.map((h) => {
			// h has index, x, y, adjNodes, adjEdges, ...
			return new Edge({store, ...h, ...store.getState().map.edgeContents[h.index]})
		})		
	}
	
	static where({store, idArray=[]}) {
		return this.all({store}).filter((e) => idArray.includes(e.props.index) )
	}

	static find({store, id}) {
		return this.all({store}).filter((e) => id == e.props.index )[0]
	}
	
	
	render() {
		this.styles = {
			unpaved: {
				backgroundColor: "brown",
				width: edgeThickness,
				height: Globals.hexagonSpacing * 0.51,
				position: "absolute",
				left: -edgeThickness * 0.5 + this.coordinates.x * Globals.hexagonSpacing,
				top: -Globals.hexagonSpacing * 0.25 - this.coordinates.y * Globals.hexagonSpacing,			
			},
			paved: {
				borderColor: "brown", 
				borderWidth: 4, 
			
				backgroundColor: this.props.owner ? this.props.owner.props.color : "white",
				width: 22,
				height: Globals.hexagonSpacing * 0.51,
				position: "absolute",
				left: -edgeThickness * 0.5 + this.coordinates.x * Globals.hexagonSpacing,
				top: -Globals.hexagonSpacing * 0.25 - this.coordinates.y * Globals.hexagonSpacing,			
			},
		}

		return (
			 <TouchableOpacity key={`edge_${ this.props.index }`} onPress={ this.props.onPress }>
				<View transform={[{ rotate: `${-this.rotation }deg`} ]} 
				style={ this.props.road ? this.styles.paved : this.styles.unpaved } />
			</TouchableOpacity>
		)
	}
}


module.exports = Edge;
