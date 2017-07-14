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

		// props includes
		// worldMap
		// signedInUser
		// users
		
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
	
	rollDice() {
		if (this.context.store.getState().game.thisTurnRolled) {
			this.setState({message: "Already rolled this turn"})
		} else {
			let newRoll = Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6) 
			// this.props.worldMap.highlightNumber = newRoll
			this.context.store.dispatch({ type: "ROLL", rollValue: newRoll })
			this.setState({thisTurnRolled: newRoll, message: undefined})
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
	
	
  render() {
	  let state = this.context.store.getState()
	  let turnOfUser = state.game.players[ state.game.turn ]
	  
    return (
		<View style={styles.container}>
        
			<View style={{ flexDirection: "row", justifyContent: "flex-start", padding: 10, backgroundColor: "tan" }}>
			 	<View style={{ backgroundColor: turnOfUser.color, height: 50, width: 50 }} />

			 	<View style={{ flex: 1 }}>
			 		{ 
						( turnOfUser == this.props.signedInUser ) ?
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
	 			onPressNode={ (x) => {this.goToNode(x)} }  />
			
			
				<UserAssetsShow user={ this.props.signedInUser }/>

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
	signedInUser: React.PropTypes.object
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