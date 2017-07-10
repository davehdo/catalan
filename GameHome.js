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
	  // generate a map
	  // if (this.state.world_map == undefined) {
	  // 		  
	  // }


    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => {this.props.navigator.push({
		  title: 'Node',
		  component: NodeShow,
		  passProps: { }
		}) }}>
		 <Text style={styles.description}>
          Search for houses to buy!
        </Text>
		 </TouchableOpacity>
		 
		<WorldMap />


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
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  }
});

module.exports = GameHome;