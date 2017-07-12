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
const Node = require('./Node');
const User = require('./User.js');
const Globals = require("./Globals.js")
const UserAssetsShow = require("./UserAssetsShow.js")



class GameHome extends Component {
	constructor(props) {
	  super(props);
	  
	  let signedInUser = new User({name: "House Lannister", color: "red"})
	  this.state = {
		  users: [new User({name: "House Tyrell", color: "teal"}), new User({name: "House Fray", color: "black"}), signedInUser],
		  round: 0,
		  signedInUser: signedInUser,
		  turnOfUser: signedInUser,
		  thisTurnRolled: undefined,
		  phase: undefined,
		  message: undefined
		  
	  };
	  
		
  }

  goToNode(n) {
  		this.props.navigator.push({
  		  title: 'Node',
  		  component: NodeShow,
  		  passProps: {node: n, game: this}
  		});
  	}
	
	rollDice() {
		if (this.state.thisTurnRolled) {
			this.setState({message: "Already rolled this turn"})
		} else {
			let newRoll = Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6) 
			this.worldMap.setState({highlightNumber: newRoll})
			this.setState({thisTurnRolled: newRoll})


		}
			
	}
	
	endTurn() {
		let currentIndex = this.state.users.indexOf( this.state.turnOfUser )
		let newIndex = (currentIndex + 1 >= this.state.users.length) ? 0 : currentIndex + 1
		let newRound = this.state.round + (currentIndex + 1 >= this.state.users.length ? 1 : 0)
		
		this.setState({turnOfUser: this.state.users[newIndex], round: newRound, thisTurnRolled: undefined})
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
						 Round { this.state.round }
					</Text>
						 
			 	</View>
			</View>
			
		 				
	 		<WorldMap ref={(e) => { this.worldMap = e }} 
				navigator={ this.props.navigator }
	 			turnOfUser={ this.state.turnOfUser }
	 			highlightNumber={ this.state.thisTurnRolled }
	 			onPressNode={ this.goToNode }
	 			/>
			
			
		 	<UserAssetsShow user={ this.state.signedInUser }/>

 			<View style={{ flexDirection: "row", backgroundColor: "tan", padding: 10}}>
	 				 <Button
	 				   onPress={() => this.endTurn()}
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