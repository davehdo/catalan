'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
	// TouchableOpacity,
	// Button
} from 'react-native';

// const WorldMap = require('./WorldMap');
// const NodeShow = require('./NodeShow');
// const Node = require('./Node');
// const User = require('./User.js');
const Globals = require("./Globals.js")


const Card = (props) => {
	return <View style={{alignItems: "center"}}>
				<View style={{ backgroundColor: "whitesmoke", padding: 7, margin: 4, borderRadius: 3 }}>
					<View style={{ backgroundColor: props.color, height: 45, width: 30}}></View>
		 		</View>
				<Text>{ props.count }</Text>
			</View>
}

class UserAssetsShow extends Component {
	constructor(props) {
	  super(props);
	  
	  // this.state = props.user.state;
	}

  render() {

		  
    return (
			<View style={{ flexDirection: "row", padding: 10}}>						 
				 <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
						<View style={{ flex: 2}}>

						 	<Text style={styles.smallStats}>S 3/{Globals.maxSettlements}</Text>
						 	<Text style={styles.smallStats}>C 3/{Globals.maxCities}</Text>
						 	<Text style={styles.smallStats}>R 3/{Globals.maxRoads}</Text>
						</View>
						 { Globals.resourceCardColorMapArray.map((e) => <Card key={ e[1] } count={ 1} color={ e[1]}/>)}
						
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
   }
});

module.exports = UserAssetsShow;