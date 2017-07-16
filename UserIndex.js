'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
	TouchableOpacity
} from 'react-native';

const Globals = require("./Globals.js")
const User = require("./User.js")


class UserIndex extends Component {
	constructor(props) {
	  super(props);
	  
	  let resourceCount = {}
	  Object.values(Globals.resources).map((v) => resourceCount[v] = Math.ceil( Math.random() * 10 ))
	  
	  this.state = {
		  name: this.props.name,
		  color: this.props.color,
		  resourceCount: resourceCount,
	  };
	  
	  
	}

	victoryPoints() {}
	
  render() {
    return (
		<View style={styles.container}>
		 { this.context.store.getState().game.players.map((p) => 
			<UserAssetsShow user={ p }/>
		 )}
			
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


UserIndex.contextTypes = {
	store: React.PropTypes.object,
}

module.exports = UserIndex;