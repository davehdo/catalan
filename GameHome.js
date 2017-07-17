'use strict';

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Button,
	ScrollView
} from 'react-native';

const WorldMap = require('./WorldMap');
const NodeShow = require('./NodeShow');
// const Node = require('./Node');
const User = require('./User.js');
const Globals = require("./Globals.js")
const UserAssetsShow = require("./UserAssetsShow.js")
const DevCardShow = require("./DevCardShow.js")

class GameHome extends Component {
	constructor(props) {
		super(props);

		this.state = {
			message: undefined // not quite relevant to the nonactive users--personalize this?
		};		
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
		
		if (this.anyBarriersToBuyingOrEndingTurn())
			return false
		
		let edge = edges.filter((e) => e.index == edgeId)[0]
		if (edge && edge.road )
			return this.setState({message: "There is already a road there"})
			
		if (edge.adjacentEdges().filter((e) => e.road && e.userId == userId).length == 0 &&
				edge.adjacentNodes().filter((e) => e.buildingType && e.userId == userId).length == 0)
			return this.setState({message: "Warning: no adjacent road/building"})
		if (User.withTurn({store: this.context.store}).nRoads() >= Globals.maxRoads)
			return this.setState({message: "No road pieces remain"})
			
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
		
		if (this.anyBarriersToBuyingOrEndingTurn())
			return false
		
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
		if ( node.surroundedByUser() != undefined && node.surroundedByUser() != userId)
			return this.setState({message: "Cannot build in the middle of someone else's road"})
			
			let price
		if (node && node.buildingType == 1)	{
			// upgrade settlement to city
			price = {ORE: -2, WHEAT: -3}
			if (!User.withTurn({store: this.context.store}).canAfford( price ))
				return this.setState({message: "Not enough resources to build city"})
			if (User.withTurn({store: this.context.store}).nCities() >= Globals.maxCities)
				return this.setState({message: "Max cities reached"})	
			this.context.store.dispatch({ type: "BUILD_NODE", userId, nodeId })
			this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId, ...price})
		} else {
			// build a settlement
			price = {LUMBER: -1, BRICK: -1, SHEEP: -1, WHEAT: -1}
			if (!User.withTurn({store: this.context.store}).canAfford( price ))
				return this.setState({message: "Not enough resources to build settlement"})
			if (User.withTurn({store: this.context.store}).nSettlements() >= Globals.maxSettlements)
				return this.setState({message: "Max settlements reached"})	
			
			this.context.store.dispatch({ type: "BUILD_NODE", userId, nodeId })
			this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId, ...price})
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
		
		return Globals.nodes.map((h) => {
			const associationMethods = {
					adjacentNodes: () => this.nodeAll().filter((n) => h.adjNodes.indexOf(n.index) != -1 ),
					adjacentEdges: () => this.edgeAll().filter((n) => h.adjEdges.indexOf(n.index) != -1 )
			}
			return Object.assign(associationMethods, {
				surroundedByUser: () => {
					let counts = []
					let dupFound = undefined 
					let ownerIds = associationMethods.adjacentEdges()
						.filter((e) => e.road)
						.map((e) => e.userId)

					ownerIds.map((id) => {
						if (counts.indexOf(id) == -1) {counts.push(id)} else {dupFound = id}
					})
					return dupFound
				}
			}, h, nodeContents[h.index])
		})
	}


	rollDice() {
		let state = this.context.store.getState()
		if (state.game.requireRobberMove)
			return this.setState({message: "Robber move required"})			
		if (state.game.thisTurnRolled) 
			return this.setState({message: "Already rolled this turn"})
		
		let newRoll = Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6) 
		// this.props.worldMap.highlightNumber = newRoll
		this.context.store.dispatch({ type: "ROLL", rollValue: newRoll })
		
		
		if (newRoll == 7) {
			this.context.store.dispatch({type: "REQUIRE_ROBBER_MOVE"})
			this.setState({message: "Move the robber by tapping a hexagon"})
		} else {			
			this.setState({message: undefined})	
		}
		// reward the players 
		let winningHexagons = this.hexagonAll().filter((h) => h.number == newRoll && !h.robber)
		
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
	
	moveRobber(hexId) {
		let state = this.context.store.getState()
		if (!state.game.requireRobberMove)
			return false // end silently		
		if (state.map.hexagonContents[hexId].robber)
			return this.setState({message: "Must move robber to a different space"})
		this.context.store.dispatch({ type: "MOVE_ROBBER", hexId: hexId})
		this.setState({message: undefined})
	}
	
	
	endTurn() {
		let state = this.context.store.getState()
		if (this.anyBarriersToBuyingOrEndingTurn())
			return false		
		if (state.game.thisTurnRolled == undefined) 
			return this.setState({message: "Must roll first"})
			
		this.context.store.dispatch({ type: "END_TURN" })
		this.setState({message: undefined})
			
	}
	
	anyBarriersToBuyingOrEndingTurn() { // catch things user must do before ending turn OR buying anything
		let state = this.context.store.getState()
		if (state.game.requireRobberMove) {
			this.setState({message: "Robber move required"})		
			return true
		}
		if (state.game.thisTurnRolled == undefined) {
			this.setState({message: "Must roll dice first" })
			return true
		}
		// if (!User.signedIn({store: this.context.store}).ownsTurn()) {// this should get moved to anyBarriersToBuyingOrEndingTurn
		// 	this.setState({message: "It's not your turn"})
		// 	return true
		// }
		return false
	}
	
	buyDevCard( user ) {
		// let state = this.context.store.getState()
		let cost = { ORE: -1, WHEAT: -1, SHEEP: -1 }
		let warning 
		
		if (this.anyBarriersToBuyingOrEndingTurn())
			return false
		if (!user.canAfford( cost ))
			return this.setState({message: "Not enough resources to buy this"})
				
		this.context.store.dispatch({ type: "DRAW_DEV_CARD", userId: user.props.id, rand: Math.random() })
		this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId: user.props.id, ...cost})
		this.setState({message: warning})
	}
	
	onPressDevCard( card, user ) {
		// this.setState({message: `Pressed ${ card }`})
		
		switch( card.id ) {
		case "DEV_KNIGHT":
			this.props.navigator.push({
				title: 'Development Card',
				component: DevCardShow,
				passProps: {card: card, onPressPlay: () => {
					// is it your turn
					if (User.withTurn({store: this.context.store}).id != user.id)
						return "It's not your turn"
					return "SUCCESS"
						
					// this.props.navigator.shift()
				}}
			});
		
		case "DEV_VP":
			this.props.navigator.push({
				title: 'Development Card',
				component: DevCardShow,
				passProps: {card: card, onPressPlay: () => {
					if (User.withTurn({store: this.context.store}).id != user.id)
						return "It's not your turn"
					return "SUCCESS"
				}}
			});
		
			
		case "DEV_ROAD":
			this.props.navigator.push({
				title: 'Development Card',
				component: DevCardShow,
				passProps: {card: card, onPressPlay: () => {
					if (User.withTurn({store: this.context.store}).id != user.id)
						return "It's not your turn"
					return "SUCCESS"
				}}
			});
		
			
		case "DEV_MONOPOLY":
			return false
			
		case "DEV_PLENTY":
			return false
			
		default: 
			return false
		}
		
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
						( User.withTurn({store: this.context.store}).isSignedIn() ) ?
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
			
			<ScrollView contentContainerStyle={{ top: -60 }}>
					<WorldMap 
			 			highlightNumber={ state.game.thisTurnRolled }
			 			onPressNode={ (id) => this.buildNode( {userId: User.withTurn({store: this.context.store}).props.id, nodeId: id } )}
						onPressEdge={ (id) => this.buildRoad( {userId: User.withTurn({store: this.context.store}).props.id, edgeId: id } )} 
						onPressHexagon={ (id) => this.moveRobber(id)} 
						userById={ (id) => this.userById(id) }
						map={ state.map } />
			
						<UserAssetsShow user={ User.signedIn({store: this.context.store}) } onPressDevCard={ (c) => this.onPressDevCard(c, User.signedIn({store: this.context.store}))  }/>
			</ScrollView>
					
 			<View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "black", padding: 10}}>
	 				 <Button
	 				   onPress={() => this.endTurn()}
	 				   title="End my turn"
	 				   color="white"
	 				   accessibilityLabel="Learn more about this purple button"
	 				 />
					
	 				 <Button
	 				   onPress={ () => this.rollDice() }
	 				   title="Roll"
	 				   color="white"
	 				   accessibilityLabel="Learn more about this purple button"
	 				 />
	 				 <Button
	 				   onPress={ () => this.buyDevCard( User.signedIn({store: this.context.store}) ) }
	 				   title="Buy Dev Card"
	 				   color="white"
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
    marginTop: 65, // to offset the nav at the top
    alignItems: 'stretch', // stretches to 100% width (cross-axis)
	 backgroundColor: "tan"
  }
});

module.exports = GameHome;