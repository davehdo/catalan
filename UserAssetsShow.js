'use strict';

import React, { Component } from 'react';
import {
  // AppRegistry,
  StyleSheet,
  Text,
  View,
	// TouchableOpacity,
	// Button
} from 'react-native';

const Globals = require("./Globals.js")

const Card = (props) => {
	return <View>
				<View style={ styles.cardOuter }>
					<View style={{ backgroundColor: props.color, flex: 1 }}></View>
		 		</View>
				<View style={styles.bottomRightCircle}>
					<Text style={{ backgroundColor: "transparent", color: "white", fontSize: 10}}>{ props.count }</Text>
				</View>
				{ props.countUsed ? <View style={styles.upperLeftCircle}>
					<Text style={{ backgroundColor: "transparent", color: "white", fontSize: 10}}>{ props.countUsed }</Text>
				</View> : <View />}
			</View>
}

class UserAssetsShow extends Component {
	constructor(props) {
	  super(props);
	  
	  // this.state = props.user.state;
	}

  render() {
    return (
				 <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", padding: 10 }}>
						<View style={{ flex: 2}}>

						 	<Text style={styles.smallStats}>S { this.props.user.nSettlements() }/{Globals.maxSettlements}</Text>
						 	<Text style={styles.smallStats}>C { this.props.user.nCities() }/{Globals.maxCities}</Text>
						 	<Text style={styles.smallStats}>R { this.props.user.nRoads() }/{Globals.maxRoads}</Text>
						 	<Text style={styles.smallStats}>VP { this.props.user.victoryPoints() }</Text>
						</View>
			 			<View style={{ flex: 4}}> 
							<View style={{flexDirection: "row", marginBottom: 10}} >						 
						 		{ Globals.resourceCardColorMapArray.map((e) => 
									<Card key={ e[1] } count={ this.props.user.resourceCount[e[0]]} color={ e[1]}/>)
								}
						 	</View>
							<View style={{flexDirection: "row"}} >
						 		{ Object.keys(Globals.devCards).map((e) => 
									<Card key={ e } count={ this.props.user.devCount[e]} countUsed={ this.props.user.devUsedCount[e]} color={ "black"}/>)
								}
						 	</View>
						</View>
				 </View>
    );
  }
}

const nodeDiameter = 20
var styles = StyleSheet.create({
	cardOuter: {
		margin: 6, 
		backgroundColor: "whitesmoke", padding: 6, 
		borderRadius: 3, 
		height: 45, width: 33
	},
   description: {
     marginBottom: 20,
     fontSize: 18,
     textAlign: 'center',
     color: '#656565'
   },
   smallStats: {
     fontSize: 12,
     textAlign: 'center',
     color: '#656565'
   },
	bottomRightCircle: {
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		width: nodeDiameter,
		height: nodeDiameter,
		borderRadius: nodeDiameter / 2.0,
		backgroundColor: '#cc0000',
		right:  0,
		bottom: 0,
		
	},
	upperLeftCircle: {
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		width: nodeDiameter,
		height: nodeDiameter,
		borderRadius: nodeDiameter / 2.0,
		backgroundColor: '#333',
		left:  0,
		left: 0,
		
	},
});

UserAssetsShow.contextTypes = {
	store: React.PropTypes.object,
}

module.exports = UserAssetsShow;