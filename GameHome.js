'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';


class GameHome extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
	    searchString: 'london'
	  };
	}
	
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Search for houses to buy!
        </Text>
        <Text>
          Search by place-name, postcode or search near your location. Search by place-name, postcode or search near your location. Search by place-name, postcode or search near your location. Search by place-name, postcode or search near your location.
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

module.exports = GameHome;