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


const edgeThickness = 16 / 220 * Globals.hexagonSpacing
const clickableBoxThickness = 50 / 220 * Globals.hexagonSpacing

class Edge extends Component{
	constructor(props) {
		super(props);
		
		this.coordinates = {x: this.props.x, y: this.props.y} || {x: 0, y: 0}
		
		const indexOnes = Math.abs(this.props.index) % 10.0

		this.rotation = {
			0: -60,
			1: 0,
			2: 60
		}[ indexOnes ]
	}
	
	// const Hexagon = require("./Hexagon.js")
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
	
	adjacentNodes() {
		const HexNode = require("./HexNode.js")
		return HexNode.where({store: this.props.store, idArray: this.props.adjNodes})
	} 
	
	adjacentEdges() {
		return Edge.where({store: this.props.store, idArray: this.props.adjEdges})		
	} 
	
	
	
	render() {
		this.styles = {
			unpaved: {
				backgroundColor: "brown",
				width: edgeThickness,
				height: Globals.hexagonSpacing * 0.51,
				position: "absolute",
				left: -edgeThickness * 0.5,
				top: -Globals.hexagonSpacing * 0.25,			
			},
			paved: {
				borderColor: "brown", 
				borderWidth: 4, 
			
				backgroundColor: this.props.owner ? this.props.owner.props.color : "purple",
				width: 22,
				height: Globals.hexagonSpacing * 0.51,
				position: "absolute",
				left: -edgeThickness * 0.5,
				top: -Globals.hexagonSpacing * 0.25,			
			},
			clickableBox: {
				backgroundColor: "transparent",
				width: clickableBoxThickness,
				height: Globals.hexagonSpacing * 0.3,
				position: "absolute",
				left: -clickableBoxThickness * 0.5,
				top: -Globals.hexagonSpacing * 0.15,			
			},
		}

		return (
			//transform={[ ]}
			
			 <Touch key={`edge_${ this.props.index }`} onPress={ this.props.onPress }>
				<View transform={[
					{translateX: (Globals.hexagonSpacing * this.coordinates.x)},
					{translateY: -(Globals.hexagonSpacing * this.coordinates.y)},
					{ rotate: `${this.rotation }deg`},
				]}>
					<View style={ this.styles.clickableBox } />
					<View style={ this.props.road ? this.styles.paved : this.styles.unpaved } />
				</View>
			</Touch>
		)
	}
}

const Touch = (props) => { // takes key and onPress 
	if (props.onPress) {
		return <TouchableOpacity onPress={ props.onPress }>{ props.children }</TouchableOpacity>
	} else {
		return <View>{ props.children }</View>
	}
}


module.exports = Edge;
