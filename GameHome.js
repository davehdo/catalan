'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
	TouchableOpacity
} from 'react-native';

const WorldMap = require('./WorldMap');
const NodeShow = require('./NodeShow');

class GameHome extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		  users: [],
		  round: 0,
		  turn_of_user: undefined,
		  phase: undefined
		  
	  };
	}

  render() {
    return (
      <View style={styles.container}>
        
		<View style={{ flexDirection: "row", justifyContent: "flex-start", padding: 10, backgroundColor: "tan" }}>
		 	<View style={{ backgroundColor: "whitesmoke", height: 50, width: 50 }}>
		 	</View>
		 	<View style={{ flex: 1 }}>
				<Text style={styles.description}>
				 House Tyrell, its your turn
				</Text>
		 	</View>
		</View>
		
		<WorldMap navigator={this.props.navigator}/>
		 
		 
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
  container: {
	 flex: 1,
    // padding: 10,
    marginTop: 65,
    alignItems: 'center'
  }
});

module.exports = GameHome;