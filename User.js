'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
	TouchableOpacity
} from 'react-native';



class User extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		  name: this.props.name,
		  color: this.props.color
	  };
	}

  render() {
    return (
		<View style={styles.container}>
        


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

module.exports = User;