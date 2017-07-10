'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

const WorldMap = require('./WorldMap');

class NodeShow extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		  node: props.node,
	  };
	  

	  
	}
	
  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          This plot of land 
        </Text>
		 



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

module.exports = NodeShow;