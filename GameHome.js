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
const User = require('./User.js');

const Card = (props) => {
	return <View style={{alignItems: "center"}}>
				<View style={{ backgroundColor: "whitesmoke", padding: 7, margin: 4, borderRadius: 3 }}>
					<View style={{ backgroundColor: props.color, height: 45, width: 30}}></View>
		 		</View>
				<Text>{ props.count }</Text>
			</View>
}
class GameHome extends Component {
	constructor(props) {
	  super(props);
	  
	  let signedInUser = new User({name: "House Lannister", color: "red"})
	  this.state = {
		  users: [new User({name: "House Tyrell", color: "teal"}), new User({name: "House Fray", color: "black"}), signedInUser],
		  round: 0,
		  signedInUser: signedInUser,
		  turnOfUser: signedInUser,
		  phase: undefined
		  
	  };
	}

	endTurn() {
		let currentIndex = this.state.users.indexOf( this.state.turnOfUser )
		let newIndex = (currentIndex + 1 >= this.state.users.length) ? 0 : currentIndex + 1
		let newRound = this.state.round + (currentIndex + 1 >= this.state.users.length ? 1 : 0)
		
		this.setState({turnOfUser: this.state.users[newIndex], round: newRound})
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
			 { this.state.turnOfUser.state.name }, its your turn{ "\n" }
			 Tap a spot on the map to build
		</Text>
			 :
		<Text style={styles.description}>
			 Waiting on { this.state.turnOfUser.state.name }
		</Text>
		 
		 }
					<Text style={ styles.smallStats }>
						 Round { this.state.round }
					</Text>
						 
			 	</View>
			</View>
		
			<WorldMap navigator={this.props.navigator}/>
		 
			<View style={{ flexDirection: "row", backgroundColor: "tan", padding: 10}}>
				 <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
						<Card count={3} color="forestgreen"/>
						<Card count={1} color="gold"/>
						<Card count={2} color="darkred"/>
						<Card count={1} color="silver"/>
						<Card count={1} color="lightgreen"/>
				 </View>
			</View>
						 
 			<View style={{ flexDirection: "row", backgroundColor: "tan", padding: 10}}>
	 				 <Button
	 				   onPress={() => this.endTurn()}
	 				   title="End my turn"
	 				   color="#841584"
	 				   accessibilityLabel="Learn more about this purple button"
	 				 />
					
	 				 <Button
	 				   onPress={() => this.buildCity()}
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
    alignItems: 'center'
  }
});

module.exports = GameHome;