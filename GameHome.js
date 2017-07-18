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
// const NodeShow = require('./NodeShow');
// const Node = require('./Node');
const User = require('./User.js');
const Globals = require("./Globals.js")
const UserAssetsShow = require("./UserAssetsShow.js")
const DevCardShow = require("./DevCardShow.js")


const HexNode = require("./HexNode.js")
const Edge = require("./Edge.js")
const Hexagon = require("./Hexagon.js")


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
	
	//
	// goToNode(n) {
	// 	this.props.navigator.push({
	// 		title: 'Node',
	// 		component: NodeShow,
	// 		passProps: {node: n }
	// 	});
	// }
	
	
	buildRoad({user, edge}) {
		let state = this.context.store.getState()
		
		if (this.anyBarriersToBuyingOrEndingTurn({user, onViolation: ({message}) => this.setState({message}) }))
			return false
		if (edge.props.road)
			return this.setState({message: "There is already a road there"}) // works 7/17/2017
		if (edge.adjacentEdges().filter((e) => e.props.road && e.props.userId == user.props.id).length == 0 &&
				edge.adjacentNodes().filter((e) => e.props.buildingType && e.props.userId == user.props.id).length == 0)
			return this.setState({message: "Warning: no adjacent road/building"}) // works 7/17/2017
		if (User.withTurn({store: this.context.store}).nRoads() >= Globals.maxRoads)
			return this.setState({message: "No road pieces remain"})
		if (false) {
			// cannot build through someones building
		}	
		const price = {LUMBER: -1, BRICK: -1}
			
			
		if (state.game.roadBuildingCredits > 0) { // if theres a road credit
			this.context.store.dispatch({type: "REDEEM_ROAD_CREDIT"})
			this.setState({message: `There are ${state.game.roadBuildingCredits} road credits left`})
		} else if (user.canAfford( price )) { // works 7/17/2017
			this.context.store.dispatch({ type: "BUILD_EDGE", userId: user.props.id, edgeId: edge.props.index }) 
			this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId: user.props.id, ...price})
			this.setState({message: "Built road!"}) 
		} else {
			this.setState({message: "Not enough resources"}) // works 7/17/2017
		}
	}


	buildNode({user, node}) {
		const store = this.context.store 
		
		let warning
		// let nodes = Node.all({store})
		
		if (this.anyBarriersToBuyingOrEndingTurn({user, onViolation: ({message}) => this.setState({message})}))
			return false
		
		// look for reasons not to allow building
		if (node.props.buildingType >= 1 && node.props.userId != user.props.id)
			return this.setState({message: "Someone else has already built here"}) // works 7/17/2017
		if (node.props.buildingType == 2)
			return this.setState({message: "There is already a city here"}) // works 7/17/2017
		if (node.adjacentNodes().filter((n) => n.props.buildingType).length > 0)
			return this.setState({message: "Too close to other buildings"}) // works 7/17/2017
		if (node.adjacentEdges().filter((e) => e.props.road && e.props.userId == user.props.id).length == 0)
			warning = "Warning: theres no adjacent road" // works 7/17/2017
		// see if any one owner (thats no the building user) owns 2 or more nodes
		if ( node.surroundedByUser() != undefined && node.surroundedByUser() != user.props.id)
			return this.setState({message: "Cannot build in the middle of someone else's road"}) // works 7/17/2017
			
		let price
		if (node.props.buildingType == 1)	{
			// upgrade settlement to city
			price = {ORE: -2, WHEAT: -3}
			if (!user.canAfford( price ))
				return this.setState({message: "Not enough resources to build city"})
			if (user.nCities() >= Globals.maxCities)
				return this.setState({message: "Max cities reached"})	
			this.context.store.dispatch({ type: "BUILD_NODE", userId: user.props.id, nodeId: node.props.index }) // works 7/17/2017
			this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId: user.props.id, ...price})
		} else {
			// build a settlement
			price = {LUMBER: -1, BRICK: -1, SHEEP: -1, WHEAT: -1}
			if (!user.canAfford( price ))
				return this.setState({message: "Not enough resources to build settlement"})
			if (user.nSettlements() >= Globals.maxSettlements)
				return this.setState({message: "Max settlements reached"})	
			
			this.context.store.dispatch({ type: "BUILD_NODE", userId: user.props.id, nodeId: node.props.index }) // works 7/17/2017
			this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId: user.props.id, ...price})
		}
		return this.setState({message: warning})
		
	}
	


	rollDice({ user }) {
		let state = this.context.store.getState()
		if (state.game.requireRobberMove)
			return this.setState({message: "Robber move required"})  // works 7/17/2017
		if (state.game.thisTurnRolled) 
			return this.setState({message: "Already rolled this turn"})  // works 7/17/2017
		
		// =================================  roll  =================================
		let newRoll = Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6) 
		// this.props.worldMap.highlightNumber = newRoll
		this.context.store.dispatch({ type: "ROLL", rollValue: newRoll })
		
		if (newRoll == 7) {
			this.context.store.dispatch({type: "REQUIRE_ROBBER_MOVE"})
			this.setState({message: "Move the robber by tapping a hexagon"})  // works 7/17/2017
		} else {			
			this.setState({message: undefined})	
		}
		
		// ==========================  reward the players  ==========================
		let winningHexagons = Hexagon.all({store: this.context.store }).filter((h) => h.props.number == newRoll && !h.robber)
		
		winningHexagons.map((hex) => {
			hex.adjacentNodes().map((node) => {
				if (node.props.buildingType) {
					let action = {type: "ADJUST_RESOURCES", userId: node.props.userId}
					action[ hex.resource ] = node.props.buildingType
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
	
	
	endTurn({ user }) {
		const onViolation = ({message}) => {
			this.props.navigator.pop()
			this.setState({message})
		}
		
		let state = this.context.store.getState()
		if (this.anyBarriersToBuyingOrEndingTurn({user, onViolation}))
			return false		
		if (state.game.roadBuildingCredits > 0)
			return this.setState({message: `There are ${state.game.roadBuildingCredits} road credits left`})
		this.context.store.dispatch({ type: "END_TURN" })
		this.setState({message: undefined})
			
	}
	
	anyBarriersToBuyingOrEndingTurn({user, onViolation, except = []}) { // catch things user must do before ending turn OR buying anything
		let state = this.context.store.getState()
		if (!user.ownsTurn()) {// this should get moved to anyBarriersToBuyingOrEndingTurn
			onViolation({message: "It's not your turn"})
			return true
		}
		if (state.game.requireRobberMove) {
			onViolation({message: "Robber move required"})
			return true
		}
		if (state.game.thisTurnRolled == undefined && !except.includes("dice")) {
			onViolation({message: "Must roll dice first" }) // works 7/17/2017
			return true
		}
		return false
	}
	
	buyDevCard({ user }) {
		// let state = this.context.store.getState()
		let cost = { ORE: -1, WHEAT: -1, SHEEP: -1 }
		const onViolation = ({message}) => this.setState({message})
		
		if (this.anyBarriersToBuyingOrEndingTurn({user, onViolation}))
			return false
		if (!user.canAfford( cost ))
			return this.setState({message: "Not enough resources to buy this"})
				
		this.context.store.dispatch({ type: "DRAW_DEV_CARD", userId: user.props.id, rand: Math.random() })
		this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId: user.props.id, ...cost})
		this.setState({message: "Bought Development Card"})
	}
	
	onPressDevCard({ card, user }) {
		// this.setState({message: `Pressed ${ card }`})
		const onViolation = ({message}) => {
			this.props.navigator.pop()
			this.setState({message})
		}
		
		switch( card.id ) {
		case "DEV_KNIGHT":
			this.props.navigator.push({
				title: 'Development Card',
				component: DevCardShow,
				passProps: {card: card, onPressPlay: () => {
					if (this.anyBarriersToBuyingOrEndingTurn({user, onViolation, except: ["roll"]})) // allow knight to be played before the roll
						return false
					if (this.context.store.getState().game.thisTurnDevCardPlayed) {
						return onViolation({message: "Can play one Dev Card per turn"})
					}
						
					this.context.store.dispatch({type: "USE_DEV_CARD", card: card.id, userId: user.props.id})
					this.props.navigator.pop()
					// this.context.store.dispatch({type: "REQUIRE_ROBBER_MOVE"}) // this is automatic
					this.setState({message: "Played a knight. Move the robber by tapping a hexagon."})
				}}
			});
		case "DEV_VP":
			this.props.navigator.push({
				title: 'Development Card',
				component: DevCardShow,
				passProps: {card: card, onPressPlay: () => {
					this.props.navigator.pop() // no obstacles to hitting play, although doesn't do anything because this is a passive card
				}}
			});
		case "DEV_ROAD":
			this.props.navigator.push({
				title: 'Development Card',
				component: DevCardShow,
				passProps: {card: card, onPressPlay: () => {
					if (this.anyBarriersToBuyingOrEndingTurn({user, onViolation}))
						return false
					this.props.navigator.pop()
					this.context.store.dispatch({type: "USE_DEV_CARD", card: card.id, userId: user.props.id}) // this adds 2 road building credits
					this.setState({message: "Played road building card. Build two roads"})
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
	  const store = this.context.store
	  let state = this.context.store.getState()
	  // for now we treat the interface as if its whichever user owns the turn, but eventually will change this to signedIn
	  let user = User.withTurn({store: this.context.store}) 
	  
    return (
		<View style={styles.container}>
      	
			<View style={{ flexDirection: "row", justifyContent: "flex-start", padding: 10, backgroundColor: "tan" }}>
			 	<View style={{ backgroundColor: user.props.color, height: 50, width: 50 }} />

			 	<View style={{ flex: 1 }}>
			 		{ 
						( user.isSignedIn() ) ?
					<Text style={styles.description}>
						 { user.props.name }, its your turn{ "\n" }
						 { state.game.thisTurnRolled ? `Rolled ${ state.game.thisTurnRolled}. Tap map to build` : "Roll dice"}
						 
					</Text>
						 :
					<Text style={styles.description}>						 
						 Waiting on { user.props.name }{ "\n" }
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
		 			onPressNode={ (id) => this.buildNode({user, node: HexNode.find({id, store})} )}
					onPressEdge={ (id) => this.buildRoad({user, edge: Edge.find({id, store})} )} 
					onPressHexagon={ (id) => this.moveRobber(id)} 
					userById={ (id) => User.find({id, store: this.context.store}) }
					map={ state.map } />
		
				<UserAssetsShow user={ User.signedIn({store}) } 
					onPressDevCard={ (c) => this.onPressDevCard({card: c, user }) }/>
			</ScrollView>
					
 			<View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "black", padding: 10}}>
	 				 <Button
	 				   onPress={() => this.endTurn({user })}
	 				   title="End my turn"
	 				   color="white"
	 				   accessibilityLabel="Learn more about this purple button"
	 				 />
					
	 				 <Button
	 				   onPress={ () => this.rollDice({user }) }
	 				   title="Roll"
	 				   color="white"
	 				   accessibilityLabel="Learn more about this purple button"
	 				 />
	 				 <Button
	 				   onPress={ () => this.buyDevCard({user }) }
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