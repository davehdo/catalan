'use strict';

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Button
} from 'react-native';

const WorldMap = require('./WorldMap');
const NodeShow = require('./NodeShow');
// const Node = require('./Node');
const User = require('./User.js');
const Globals = require("./Globals.js")
const UserAssetsShow = require("./UserAssetsShow.js")


class GameHome extends Component {
	constructor(props) {
		super(props);

		
		this.state = {
			message: undefined // not quite relevant to the nonactive users--personalize this?
		};
		
		// this.context.store.subscribe( this.render )
		
	}

	componentDidMount() {
		const { store } = this.context
		this.unsubscribe = store.subscribe(() =>
			this.forceUpdate()
		)
	}
	
	componentWillUnmount() {
			this.unsubscribe()
	}
	

	goToNode(n) {
		this.props.navigator.push({
			title: 'Node',
			component: NodeShow,
			passProps: {node: n }
		});
	}
	
	
	buildRoad( {userId, edgeId} ) {
		let edges = this.edgeAll()
		let warning
		
		let edge = edges.filter((e) => e.index == edgeId)[0]
		if (edge && edge.road )
			return this.setState({message: "There is already a road there"})
			
		if (edge.adjacentEdges().filter((e) => e.road && e.userId == userId).length == 0)
			warning = "Warning: no adjacent road"
			
		// cannot build through someones building
			
		this.context.store.dispatch({ type: "BUILD_EDGE", userId, edgeId }) 
		this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId, LUMBER: -1, BRICK: -1})
		this.setState({message: warning})
	}

	nodeLacksNeighbors( nodeId ) {
		
		let nodeCoords = Globals.nodes.filter((e) => e.index == nodeId)[0]
		let nodeContents = this.context.store.getState().map.nodeContents
		
		return nodeCoords.adjNodes.filter((id) => nodeContents[id] && nodeContents[id].buildingType).length == 0
	}
	
	buildNode( {userId, nodeId} ) {

		let warning
		let nodes = this.nodeAll()
		let node = nodes.filter((e) => e.index == nodeId)[0]
		
		// look for reasons not to allow building
		if (node && node.buildingType >= 1 && node.userId != userId)
			return this.setState({message: "Someone else has already built here"})
		if (node && node.buildingType == 2)
			return this.setState({message: "There is already a city here"})

		if (node.adjacentNodes().filter((n) => n.buildingType).length > 0)
			return this.setState({message: "Too close to other buildings"})

		if (node.adjacentEdges().filter((e) => e.road && e.userId == userId).length == 0)
			warning = "Warning: theres no adjacent road" 
		// see if any one owner (thats no the building user) owns 2 or more nodes
		let counts = []
		let dupFound = false 
		let otherOwnerIds = node.adjacentEdges()
			.filter((e) => e.road && e.userId != userId)
			.map((e) => e.userId)

		otherOwnerIds.map((id) => {
			if (counts.indexOf(id) == -1) {
				counts.push( id )
			} else {
				dupFound = true
			}
		})
		if (dupFound)
			return this.setState({message: "Cannot build in the middle of someone else's road"})

			
		if (node && node.buildingType == 1)	{
			// upgrade settlement to city

			this.context.store.dispatch({ type: "BUILD_NODE", userId, nodeId })
			this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId, ORE: -2, WHEAT: -3})
		} else {
			// build a settlement
			this.context.store.dispatch({ type: "BUILD_NODE", userId, nodeId })
			this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId, LUMBER: -1, BRICK: -1, SHEEP: -1, WHEAT: -1})
		}
		return this.setState({message: warning})
		
	}
	
	
	hexagonAll() {
		let hexagonContents = this.context.store.getState().map.hexagonContents
		return Globals.hexagons.map((h) => Object.assign({ 
			adjacentNodes: () => this.nodeAll().filter((n) => h.adjNodes.indexOf(n.index) != -1 ),
			adjacentEdges: () => this.edgeAll().filter((n) => h.adjEdges.indexOf(n.index) != -1 )
		}, h, hexagonContents[h.index]))
	}

	// hexagonFind( arr_or_id ) {
	// 	if (typeof(arr_or_id) == "Array") {
	// 		return arr_or_id.map((id) => this.hexagonAll().filter((e) => e.index == id)[0])
	// 	} else {
	// 		return this.hexagonAll().filter((e) => e.index == arr_or_id)[0]
	// 	}
	// }
	
	edgeAll() {
		let edgeContents = this.context.store.getState().map.edgeContents
		return Globals.edges.map((h) => Object.assign({ 
			adjacentNodes: () => this.nodeAll().filter((n) => h.adjNodes.indexOf(n.index) != -1 ),
			adjacentEdges: () => this.edgeAll().filter((n) => h.adjEdges.indexOf(n.index) != -1 )
			// adjacentNodes: () => this.nodeAll().filter((n) => h.adjNodes.indexOf(n.index) != -1 )
		}, h, edgeContents[h.index]))
	}

	nodeAll() {
		let nodeContents = this.context.store.getState().map.nodeContents
		return Globals.nodes.map((h) => Object.assign({
			adjacentNodes: () => this.nodeAll().filter((n) => h.adjNodes.indexOf(n.index) != -1 ),
			adjacentEdges: () => this.edgeAll().filter((n) => h.adjEdges.indexOf(n.index) != -1 )
		}, h, nodeContents[h.index]))
	}


	userWithTurn() {
		let state = this.context.store.getState()
		return state.game.players[state.game.turn]
	}
	
	rollDice() {
		if (this.context.store.getState().game.thisTurnRolled) {
			this.setState({message: "Already rolled this turn"})
		} else {
			let newRoll = Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6) 
			// this.props.worldMap.highlightNumber = newRoll
			this.context.store.dispatch({ type: "ROLL", rollValue: newRoll })
			this.setState({message: undefined})
			
			// reward the players 
			let winningHexagons = this.hexagonAll().filter((h) => h.number == newRoll)
			
			winningHexagons.map((hex) => {
				hex.adjacentNodes().map((node) => {
					if (node.buildingType) {
						let action = {type: "ADJUST_RESOURCES", userId: node.userId}
						action[ hex.resource ] = node.buildingType
						this.context.store.dispatch(action)
					}
					
				})
				
			})
		}			
	}
	
	endTurn() {
		if (this.context.store.getState().game.thisTurnRolled) {
			this.context.store.dispatch({ type: "END_TURN" })
			this.setState({message: undefined})
			
		} else {
			this.setState({message: "Must roll first"})
		}			
	}
	
	userById( userId ) {
		let players = this.context.store.getState().game.players
		return players.filter((p) => p.id == userId)[0] 
	}
	
	
	signedInUser() {
		return this.context.store.getState().game.players.filter((e) => e.id == 0)[0] 
	}  
	
  render() {
	  let state = this.context.store.getState()
	  let turnOfUser = state.game.players[ state.game.turn ]
	  
    return (
		<View style={styles.container}>
        
			<View style={{ flexDirection: "row", justifyContent: "flex-start", padding: 10, backgroundColor: "tan" }}>
			 	<View style={{ backgroundColor: turnOfUser.color, height: 50, width: 50 }} />

			 	<View style={{ flex: 1 }}>
			 		{ 
						( turnOfUser == this.signedInUser() ) ?
					<Text style={styles.description}>
						 { turnOfUser.name }, its your turn{ "\n" }
						 { state.game.thisTurnRolled ? `Rolled ${ state.game.thisTurnRolled}. Tap map to build` : "Roll dice"}
						 
					</Text>
						 :
					<Text style={styles.description}>
						 
						 Waiting on { turnOfUser.name }{ "\n" }
						 { state.game.thisTurnRolled ? `Rolled ${ state.game.thisTurnRolled }` : "Has not rolled"}
					</Text>
		 
		 			}
					<Text style={styles.message}>{ this.state.message ? `\n${this.state.message}` : ""}</Text>
					<Text style={ styles.smallStats }>
						 Round { state.game.round }
					</Text>
						 
			 	</View>
			</View>
			
			<WorldMap 
	 			highlightNumber={ state.game.thisTurnRolled }
	 			onPressNode={ (id) => this.buildNode( {userId: this.userWithTurn().id, nodeId: id } )}
				onPressEdge={ (id) => this.buildRoad( {userId: this.userWithTurn().id, edgeId: id } )} 
				userById={ (id) => this.userById(id) }
				map={ state.map } />
			
			
			<UserAssetsShow user={ this.signedInUser() }/>
				
 			<View style={{ flexDirection: "row", backgroundColor: "tan", padding: 10}}>
	 				 <Button
	 				   onPress={() => this.endTurn()}
	 				   title="End my turn"
	 				   color="#841584"
	 				   accessibilityLabel="Learn more about this purple button"
	 				 />
					
	 				 <Button
	 				   onPress={ () => this.rollDice() }
	 				   title="Roll"
	 				   color="#841584"
	 				   accessibilityLabel="Learn more about this purple button"
	 				 />
 			</View>
						 
      </View>
    );
  }
}

// allows us to access store as this.context.store
GameHome.contextTypes = {
	store: React.PropTypes.object,
}

var styles = StyleSheet.create({
   description: {
     fontSize: 16,
     textAlign: 'center',
     color: '#656565'
   },
   message: {

     fontSize: 16,
     textAlign: 'center',
     color: 'blue'
   },
   smallStats: {

     fontSize: 12,
     textAlign: 'center',
     color: '#656565'
   },
  container: {
	 flex: 1,
    // padding: 10,
    marginTop: 65,
    alignItems: 'center',
	  backgroundColor: "tan"
  }
});

module.exports = GameHome;