/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
	NavigatorIOS
} from 'react-native';

const GameHome = require('./GameHome');

export default class Catalan extends Component {
  render() {
    return (
		 <NavigatorIOS
		 style={styles.container}
        initialRoute={{
          title: 'Catalan',
          component: GameHome,
        }}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('Catalan', () => Catalan);
