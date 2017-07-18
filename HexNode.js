'use strict';

import React, { Component } from 'react';
import {
  // AppRegistry,
  StyleSheet,
  Text,
  View,
	TouchableOpacity
} from 'react-native';

const Globals = require("./Globals.js")
const nodeDiameter = 30
const settlementWidth = 55
const cityWidth = 80



class HexNode extends Component{
	constructor(props) {
		super(props); // x, y, buildingType, userId

		this.coordinates = {x: this.props.x, y: this.props.y} || {x: 0, y: 0}
		
	}
	
	static all({store}) {		
		return Globals.nodes.map((h) => {
			// h has index, x, y, adjNodes, adjEdges, ...
			return new HexNode({store, ...h, ...store.getState().map.nodeContents[h.index]})
		})		
	}
	
	static where({store, idArray=[]}) {
		return this.all({store}).filter((e) => idArray.includes(e.props.index) )
	}

	static find({store, id=[]}) {
		return this.all({store}).filter((e) => id == e.props.index )[0]
	}
	
	surroundedByUser() {
		let counts = []
		let dupFound = undefined 
		let ownerIds = this.adjacentEdges()
			.filter((e) => e.props.road)
			.map((e) => e.props.userId)

		ownerIds.map((id) => {
			if (counts.indexOf(id) == -1) {counts.push(id)} else {dupFound = id}
		})
		return dupFound
	}
	
	
	adjacentNodes() {
		return HexNode.where({store: this.props.store, idArray: this.props.adjNodes})
	} 
	
	adjacentEdges() {
		const Edge = require("./Edge.js")
		// const Hexagon = require("./Hexagon.js")
		return Edge.where({store: this.props.store, idArray: this.props.adjEdges})		
	} 

	// return arrays of all the trails from this point that do not repeat edges
	trail({userId, edgeHist = []}) {
		if ((edgeHist).length >= 20)
			return false // "ERR: too long"
			
		let nextEdges = this.adjacentEdges().filter((e) => e.props.userId == userId && !(edgeHist).includes(e.props.index))
		
		if (nextEdges.length > 0) {
			let nextAccessibleNodes = nextEdges.map((e) => {
				return {edge: e, node: e.adjacentNodes().filter((n) => n.props.index != this.props.index)[0]}
			})
			let max = 0
			nextAccessibleNodes.map(({edge, node}) => {				
				let thisTrail = node.trail({userId, edgeHist: [...(edgeHist), edge.props.index]})
				if (thisTrail > max) {max = thisTrail}
			})
			return max
		} else {			
			return (edgeHist).length
		}
	}
	
	displayName() {
		switch( this.props.buildingType ) {
			case 1: 
				return "Settlement"
				break;
			case 2:
				return "City"
				break;
			default:
				return "Empty lot"
		}
	}
	
	shape() {
		let color = this.props.owner ? this.props.owner.props.color : "white"
		
		switch( this.props.buildingType ) {
			case 1:
				return <View key={ `n_${this.props.index}` } transform={[
					{translateX: (Globals.hexagonSpacing * this.coordinates.x)},
					{translateY: -(Globals.hexagonSpacing * this.coordinates.y)}
				]} style={styles.settlement}>
				<View style={Object.assign({}, StyleSheet.flatten(styles.settlementHexagonInner), {backgroundColor: color})} />
			        <View style={Object.assign({}, StyleSheet.flatten(styles.settlementHexagonBefore), {borderBottomColor: color})} />
			      </View>
				break;
			case 2:
				return <View key={ `n_${this.props.index}` } transform={[
					{translateX: (Globals.hexagonSpacing * this.coordinates.x)},
					{translateY: -(Globals.hexagonSpacing * this.coordinates.y)}
				]} style={styles.city}>
				        <View style={Object.assign({}, StyleSheet.flatten(styles.cityHexagonInner), {backgroundColor: color})} />
				        <View style={Object.assign({}, StyleSheet.flatten(styles.cityHexagonBefore), {borderBottomColor: color})} />
				      </View>
				break;
			default:
				return <View key={ `n_${this.props.index}` } transform={[
					{translateX: (Globals.hexagonSpacing * this.coordinates.x)},
					{translateY: -(Globals.hexagonSpacing * this.coordinates.y)}
				]} style={ styles.circle} />
		}
	}
	
	render() {	
		return (
			<TouchableOpacity key={`node_${ this.props.index }`} onPress={ this.props.onPress	 }>
				{ this.shape() }
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	circle: {
		position: "absolute",
		width: nodeDiameter,
		height: nodeDiameter,
		borderRadius: nodeDiameter / 2.0,
		backgroundColor: 'brown',
		left:  -nodeDiameter / 2,
		top: -nodeDiameter / 2,
		
	},
   settlement: {
	  position: "absolute",
		left: -50 / 100 * settlementWidth,
		top: -25 / 100 * settlementWidth,
     width: 100 / 100 * settlementWidth,
     height: 55 / 100 * settlementWidth
   },
   settlementHexagonInner: {
     width: 100 / 100 * settlementWidth,
     height: 55 / 100 * settlementWidth,
     backgroundColor: `red`
   },
   settlementHexagonBefore: {
     position: 'absolute',
     top: -35 / 100 * settlementWidth,
     left: 0,
     width: 0,
     height: 0,
     borderStyle: 'solid',
     borderLeftWidth: 50 / 100 * settlementWidth,
     borderLeftColor: 'transparent',
     borderRightWidth: 50 / 100 * settlementWidth,
     borderRightColor: 'transparent',
     borderBottomWidth: 35 / 100 * settlementWidth,
     borderBottomColor: 'red'
   },
	
   city: {
	  position: "absolute",
		left: -50 / 100 * cityWidth,
		top: -25 / 100 * cityWidth,
     width: 100 / 100 * cityWidth,
     height: 45 / 100 * cityWidth
   },
   cityHexagonInner: {
     width: 100 / 100 * cityWidth,
     height: 45 / 100 * cityWidth,
     backgroundColor: 'red'
   },
   cityHexagonBefore: {
     position: 'absolute',
     top: -25 / 100 * cityWidth,
     left: 0,
     width: 0,
     height: 0,
     borderStyle: 'solid',
     borderLeftWidth: 30 / 100 * cityWidth,
     borderLeftColor: 'transparent',
     borderRightWidth: 30 / 100 * cityWidth,
     borderRightColor: 'transparent',
     borderBottomWidth: 25 / 100 * cityWidth,
     borderBottomColor: 'red'
   }
	
});

module.exports = HexNode;