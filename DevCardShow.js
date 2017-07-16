'use strict';

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Button,
	// ScrollView
} from 'react-native';

const Globals = require("./Globals.js")
const Card = require("./Card.js")

class DevCardShow extends Component {
	constructor(props) {
		super(props);

		this.state = {
			message: undefined // not quite relevant to the nonactive users--personalize this?
		};		
	}

  render() {
	  
    return (
		<View style={styles.container}>
			<Text style={styles.message}>{ this.state.message ? `\n${this.state.message}` : ""}</Text>

			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			 	<Card { ...this.props.card } width={ 280 }>
			 		<Text style={styles.heading}>{ this.props.card.name }</Text>{ "\n"}
					<Text style={styles.description}>{ this.props.card.description }</Text>
		 		</Card>
			</View>

 			<View style={{ flexDirection: "row", justifyContent: "center", backgroundColor: "black", padding: 10}}>
 				 <Button
 				   onPress={() => this.setState({message: this.props.onPressPlay()})}
 				   title="Play this card"
 				   color="white"
 				   accessibilityLabel="Learn more about this purple button"
 				 />
 			</View>
						 
      </View>
    );
  }
}

 
var styles = StyleSheet.create({
   heading: {
     fontSize: 16 * 1.4,
     textAlign: 'center',
     color: 'white',
		marginBottom: 8
   },   
	description: {
     fontSize: 16,
     textAlign: 'center',
     color: 'whitesmoke'
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

module.exports = DevCardShow;