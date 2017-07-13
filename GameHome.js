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
			round: 0,
			turnOfUser: this.props.signedInUser,
			thisTurnRolled: undefined,
			phase: undefined,
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
			passProps: {node: n, gameProps: this.props, gameState: this.state}
		});
	}
	
	rollDice() {
		if (this.state.thisTurnRolled) {
			this.setState({message: "Already rolled this turn"})
		} else {
			let newRoll = Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6) 
			this.props.worldMap.highlightNumber = newRoll
			this.setState({thisTurnRolled: newRoll})
		}			
	}
	
	endTurn() {
		let currentIndex = this.props.users.indexOf( this.state.turnOfUser )
		let newIndex = (currentIndex + 1 >= this.props.users.length) ? 0 : currentIndex + 1
		let newRound = this.state.round + (currentIndex + 1 >= this.props.users.length ? 1 : 0)
		
		this.setState({turnOfUser: this.props.users[newIndex], round: newRound, thisTurnRolled: undefined})
	}
	
	
  render() {
    return (
		<View style={styles.container}>
        
			<View style={{ flexDirection: "row", justifyContent: "flex-start", padding: 10, backgroundColor: "tan" }}>
			 	<View style={{ backgroundColor: this.state.turnOfUser.state.color, height: 50, width: 50 }}>
			 	</View>
			 	<View style={{ flex: 1 }}>
		 { (this.state.turnOfUser == this.state.signedInUser ) ?
		<Text style={styles.description}>
			 { this.state.turnOfUser.state.name }{ this.state.thisTurnRolled ? ` rolled ${this.state.thisTurnRolled}` : ", its your turn"}{ "\n" }
			 { this.state.thisTurnRolled ? `Tap spot on the map to build` : "Roll dice"}
			 { this.state.message ? `\n${this.state.message}` : ""}
		</Text>
			 :
		<Text style={styles.description}>
			 Waiting on { this.state.turnOfUser.state.name }{ "\n" }
			 { this.state.thisTurnRolled ? `Rolled ${this.state.thisTurnRolled}` : "Has not rolled"}
		</Text>
		 
		 }
					<Text style={ styles.smallStats }>
						 Round { this.context.store.getState().round }
					</Text>
						 
			 	</View>
			</View>
			
			<WorldMap 
	 			highlightNumber={ this.state.thisTurnRolled }
	 			onPressNode={ (x) => {this.goToNode(x)} }
	 			{...this.props.worldMap.props} />
			
			
		 	<UserAssetsShow user={ this.props.signedInUser }/>

 			<View style={{ flexDirection: "row", backgroundColor: "tan", padding: 10}}>
	 				 <Button
	 				   onPress={() => this.context.store.dispatch({ type: "END_TURN" })}
	 				   title="End my turn"
	 				   color="#841584"
	 				   accessibilityLabel="Learn more about this purple button"
	 				 />
					
	 				 <Button
	 				   onPress={() => this.rollDice()}
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
	store: React.PropTypes.object
}

var styles = StyleSheet.create({
   description: {
     marginBottom: 20,
     fontSize: 18,
     textAlign: 'center',
     color: '#656565'
   },
   smallStats: {
     marginBottom: 20,
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