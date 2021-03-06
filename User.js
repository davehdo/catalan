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
const Edge = require("./Edge.js")

class User extends Component {
	constructor(props) {
	  super(props);
	  
	  // let resourceCount = {}
	  // Object.values(Globals.resources).map((v) => resourceCount[v] = Math.ceil( Math.random() * 10 ))
	  
	  // this.state = {
	  // 		  name: this.props.name,
	  // 		  color: this.props.color,
	  // 		  resourceCount: resourceCount,
	  // };
	  //
	  
	}

	static all({store}) {
		let players = store.getState().game.players
		return players.map((p) => new User({store: store, ...p}))
	}

	static find({ id, store }) {
		let players = store.getState().game.players
		return new User({store: store, ...(players.filter((p) => p.id == id)[0] )})
	}
	
	static signedIn({ store }) {
		const targetId = 10 // = signedInId  this is temporary
		return new User({store: store, ...store.getState().game.players.filter((e) => e.id == targetId)[0]})
	}  

	static withTurn({ store }) {
		const state = store.getState()
		let player = state.game.players[state.game.turn]
		
		return new User({store: store, ...player})
	}

	isSignedIn() {
		const targetId = 10
		return this.props.id == targetId
	}
	
	ownsTurn() {
		let state = this.props.store.getState()
		let player = state.game.players[state.game.turn]
		return this.props.id == player.id
	}
	
	nSettlements() {	
		let state = this.props.store.getState()
		return Object.values(state.map.nodeContents).filter((v) => v.userId == this.props.id && v.buildingType == 1).length
	} 
	
	nCities() {
		let state = this.props.store.getState()
		return Object.values(state.map.nodeContents).filter((v) => v.userId == this.props.id && v.buildingType == 2).length
	}
	
	nRoads() {
		let state = this.props.store.getState()
		return Object.values(state.map.edgeContents).filter((v) => v.userId == this.props.id && v.road).length
	}

	victoryPoints() {
		let state = this.props.store.getState()
		
		return this.nSettlements() + 
			2 * this.nCities() + 
			this.props.devCount[ Globals.DEV_VP ] +
			(this.props.id == state.game.playerWithLongestRoad ? 2 : 0) +
			(this.props.id == state.game.playerWithLargestArmy ? 2 : 0)
	}
	
	canAfford( price ) {
		// console.log( Object.values( price ).map((p) => (price[p] || 0) + (this.props.resourceCount[p] || 0)  )  )
		return Object.keys( price ).filter((p) => price[p] + this.props.resourceCount[p] < 0).length == 0
	}
	
	longestRoad() {
		let startingEdges = Edge.all({store: this.props.store}).filter((e) => e.props.userId == this.props.id)
		
		let startingNodes = []
		let startingNodeIds = []
		startingEdges.map((e) => {
			e.adjacentNodes().map((n) => {
				if (!startingNodeIds.includes(n.props.index)) {
					startingNodes.push( n )
					startingNodeIds.push( n.props.index )
				}
			})
		})
		
		let max = 0
		let trails = startingNodes.map((s) => {
			let len = s.trail({userId: this.props.id})
			if (len > max) { max = len }
		})

		return max
	}
	
	armySize() {
		return this.props.devUsedCount.DEV_KNIGHT || 0
	}
	
  render() {
    return (
		<View style={styles.container}></View>
    );
  }
}

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
	 flex: 1,
    // padding: 10,
    marginTop: 65,
    alignItems: 'center'
  }
});

User.contextTypes = {
	store: React.PropTypes.object,
}

module.exports = User;