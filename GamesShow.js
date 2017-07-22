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
const DevCardPlentyShow = require("./DevCardPlentyShow.js")
const TradeShow = require("./TradeShow.js")
const Card = require("./Card.js")


const HexNode = require("./HexNode.js")
const Edge = require("./Edge.js")
const Hexagon = require("./Hexagon.js")


class GamesShow extends Component {
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
		let store = this.context.store
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
		
		// =========================  check longest road  ===========================
		
		
		let playerToBeat = state.game.playerWithLongestRoad ? User.find({store, id: state.game.playerWithLongestRoad}) : undefined
		let roadToBeat = state.game.playerWithLongestRoad ? playerToBeat.longestRoad() : 4
		

		User.all({store}).map((u) => {
			let thisLongestRoad = u.longestRoad()
			if (thisLongestRoad > roadToBeat) {
				playerToBeat = u
				roadToBeat = thisLongestRoad
			}
		})
		
		if (playerToBeat && (playerToBeat.props.id != state.game.playerWithLongestRoad)) {

			this.setState({message: `There is a new owner of the Longest Road!`})
			this.context.store.dispatch({type: "AWARD_LONGEST_ROAD", userId: playerToBeat.props.id})
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
		
		// ==========================  reward the players  ========================== // works 7/17/2017
		let winningHexagons = Hexagon.all({store: this.context.store }).filter((h) => h.props.number == newRoll && !h.props.robber)
		
		let adjByUserId = {}
		winningHexagons.map((hex) => {
			hex.adjacentNodes().map((node) => {
				if (node.props.buildingType) {
					if (adjByUserId[ node.props.userId ] == undefined)
						adjByUserId[ node.props.userId ] = {}
					adjByUserId[ node.props.userId ][ hex.props.resource ] = (adjByUserId[ node.props.userId ][ hex.props.resource ] || 0) + node.props.buildingType
				}
			})
		})
		
		Object.keys(adjByUserId).map((userId) => {		
			this.context.store.dispatch({type: "ADJUST_RESOURCES", userId, ...adjByUserId[userId]})
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
		if (!user.ownsTurn()) { 
			onViolation({message: "It's not your turn"}) // works 7/17/2017
			return true
		}
		if (state.game.requireRobberMove) {
			onViolation({message: "Robber move required"})
			return true
		}
		if (state.game.thisTurnRolled == undefined && !except.includes("roll_dice")) {
			onViolation({message: "Must roll dice first" }) // works 7/17/2017; exception works 7/17/2017
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
	
	trade({user}) {
		const onViolation = ({message}) => {
			this.setState({message})
		}
		
		this.props.navigator.push({
			title: 'Trade',
			component: TradeShow,
			passProps: {user, onFinalizeTrade: ({cost, benefit}) => {
				this.props.navigator.pop()
				
				if (this.anyBarriersToBuyingOrEndingTurn({user, onViolation}))  
					return false
				
				if (cost == benefit) 
					return this.setState({message: "Not a smart trade"})
				if (cost == undefined)
					return this.setState({message: "Did not choose what to give away. No trade was completed"})
				if (benefit == undefined)	
					return this.setState({message: "Did not choose what to obtain. No trade was completed"})
						
				let exchangeRate = 4
				let tradeComponents = {}
				
				tradeComponents[cost] = -exchangeRate
				tradeComponents[benefit] = 1
				
				if (!user.canAfford( tradeComponents ))
					return this.setState({message: "You cannot afford this trade"})
				
				this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId: user.props.id, ...tradeComponents})
				this.setState({message: `You traded away ${ exchangeRate } ${ cost } to obtain 1 ${ benefit }`})
				
			}}
		})
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
					let store = this.context.store
					let state = this.context.store.getState()
					
					if (this.anyBarriersToBuyingOrEndingTurn({user, onViolation, except: ["roll_dice"]})) // allow knight to be played before the roll
						return false
					if (state.game.thisTurnDevCardPlayed) {
						return onViolation({message: "Can play one Dev Card per turn"})
					}
					if (!user.props.devCount[ card.id ]) {
						return onViolation({message: "No more of this card to play"}) // works 7/18/2017
					}
					
					this.context.store.dispatch({type: "USE_DEV_CARD", card: card.id, userId: user.props.id})
					this.props.navigator.pop()
					// this.context.store.dispatch({type: "REQUIRE_ROBBER_MOVE"}) // this is automatic
					this.setState({message: "Played a knight. Move robber by tapping a hexagon."})
					
					// =========================  award largest army  ========================
					
					
					let playerToBeat = state.game.playerWithLargestArmy ? User.find({store, id: state.game.playerWithLargestArmy}) : undefined
					let roadToBeat = state.game.playerWithLargestArmy ? playerToBeat.armySize() : 2
		

					User.all({store}).map((u) => {
						let s = u.armySize()
						if (s > roadToBeat) {
							playerToBeat = u
							roadToBeat = s
						}
					})
		
					if (playerToBeat && (playerToBeat.props.id != state.game.playerWithLargestArmy)) {

						this.setState({message: `There is a new owner of the Largest Army!`})
						this.context.store.dispatch({type: "AWARD_LARGEST_ARMY", userId: playerToBeat.props.id})
					}
					
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
					let state = this.context.store.getState()
					
					if (this.anyBarriersToBuyingOrEndingTurn({user, onViolation}))
						return false
					if (state.game.thisTurnDevCardPlayed) {
						return onViolation({message: "Can play one Dev Card per turn"})
					}
					if (!user.props.devCount[ card.id ]) {
						return onViolation({message: "No more of this card to play"}) // works 7/18/2017
					}
					
					this.props.navigator.pop()
					this.context.store.dispatch({type: "USE_DEV_CARD", card: card.id, userId: user.props.id}) // this adds 2 road building credits
					this.setState({message: "Played road building card. Build two roads"})
				}}
			});
		
			
		case "DEV_MONOPOLY":
			let monopolize = ({user, resource }) => {
				this.props.navigator.pop()

				let state = this.context.store.getState()
				
				if (this.anyBarriersToBuyingOrEndingTurn({user, onViolation}))
					return false
				if (state.game.thisTurnDevCardPlayed) {
					return onViolation({message: "Can play one Dev Card per turn"})
				}
				if (!user.props.devCount[ card.id ]) {
					return onViolation({message: "No more of this card to play"}) // works 7/18/2017
				}
				
				// charge all other users
				let qtyCollected = 0
				User.all({store: this.context.store}).map((u) => {
					if (u.props.id != user.props.id) {
						let adj = {}
						adj[ resource ] = -u.props.resourceCount[ resource ]
						qtyCollected -= adj[ resource ]
						this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId: u.props.id, ...adj})
					}
				})
				
				// credit this user
				let adj2 = {}
				adj2[ resource ] = qtyCollected
				this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId: user.props.id, ...adj2})
				this.context.store.dispatch({type: "USE_DEV_CARD", card: card.id, userId: user.props.id}) // this adds 2 road building credits
				return this.setState({message: `Monopolized all the ${ resource }!`})
			}
			
			let children = 
				<View style={{ padding: 20 }}>
					<Text>Choose a resource to monopolize:</Text>
					<View style={{flexDirection: "row", justifyContent: "center", marginBottom: 10}}>						 
				 		{ Globals.resourceCardColorMapArray.map((e) => 
								<Card key={ e[1] } count={ user.props.resourceCount[e[0]]} color={e[1]} onPress={() => monopolize({user, resource: e[0]})}/>
						)}
				 	</View>
				</View>
				
			this.props.navigator.push({
				title: 'Development Card',
				component: DevCardShow,
				passProps: {card: card, children}
			});
			
		case "DEV_PLENTY":
			this.props.navigator.push({
				title: 'Development Card',
				component: DevCardPlentyShow,
				passProps: {card, user, onPressPlay: ({user, resources}) => {
					this.props.navigator.pop()

					let state = this.context.store.getState()
				
					if (this.anyBarriersToBuyingOrEndingTurn({user, onViolation}))
						return false
					if (state.game.thisTurnDevCardPlayed) {
						return onViolation({message: "Can play one Dev Card per turn"})
					}
					if (!user.props.devCount[ card.id ]) {
						return onViolation({message: "No more of this card to play"}) // works 7/18/2017
					}
				
					// credit this user
					this.context.store.dispatch({ type: "ADJUST_RESOURCES", userId: user.props.id, ...resources})
					this.context.store.dispatch({type: "USE_DEV_CARD", card: card.id, userId: user.props.id}) // this adds 2 road building credits
					return this.setState({message: `Collected 2 resources!`})
				}}
			});

			
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
			 	<View style={{ backgroundColor: user.props.color, height: 40, width: 40 }} />

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
			
			<ScrollView contentContainerStyle={{ top: -60, height: 540 }} maximumZoomScale={ 2 } bounces={ false } horizontal={ true }>
				<View style={{ alignItems: "center" }}>
					<WorldMap 
			 			highlightNumber={ state.game.thisTurnRolled }
			 			onPressNode={ !state.game.requireRobberMove ? ((id) => this.buildNode({user, node: HexNode.find({id, store})} )) : undefined}
						onPressEdge={ !state.game.requireRobberMove ? ((id) => this.buildRoad({user, edge: Edge.find({id, store})} )) : undefined} 
						onPressHexagon={ state.game.requireRobberMove ? ((id) => this.moveRobber(id)) : undefined} 
						userById={ (id) => User.find({id, store: this.context.store}) }
						map={ state.map } />
		
					<UserAssetsShow user={ User.signedIn({store}) } 
						onPressDevCard={ (c) => this.onPressDevCard({card: c, user: User.signedIn({store}) }) }/>
				</View>
			</ScrollView>
 			<View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "black", padding: 10}}>
	 				 <Button
	 				   onPress={() => this.endTurn({user })}
	 				   title="End turn"
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
	 				   onPress={ () => this.trade({user }) }
	 				   title="Trade"
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
GamesShow.contextTypes = {
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

module.exports = GamesShow;