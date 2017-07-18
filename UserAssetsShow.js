'use strict';

import React, { Component } from 'react';
import {
  // AppRegistry,
  StyleSheet,
  Text,
  View,
	TouchableOpacity,
	// Button
} from 'react-native';

const Globals = require("./Globals.js")
const Card = require("./Card.js")


const Award = (props) => {
		return <View style={ styles.award }>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ fontSize: 10, color: "red"}}>{ props.children }</Text>
			</View>
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
						<View style={{ flex: 2, alignItems: "center"}}>

						 	<Text style={styles.teamName}>{ this.props.user.props.name }</Text>
						 	<Text style={styles.smallStats}>S { this.props.user.nSettlements() }/{Globals.maxSettlements}</Text>
						 	<Text style={styles.smallStats}>C { this.props.user.nCities() }/{Globals.maxCities}</Text>
						 	<Text style={styles.smallStats}>R { this.props.user.nRoads() }/{Globals.maxRoads}</Text>
						 	<Text style={styles.smallStats}>VP { this.props.user.victoryPoints() }</Text>
							<Text style={styles.smallStats}>LR { this.props.user.longestRoad() }</Text>
		 					<Award>Longest road</Award>
		 					<Award>Largest army</Award>
						</View>
			 			<View style={{ flex: 4}}> 
							<View style={{flexDirection: "row", marginBottom: 10}} >						 
						 		{ Globals.resourceCardColorMapArray.map((e) => {
									const l = this.props.user.props.lastResourceAdjustment
									let adj = l ? l[e[0]] : undefined;
									return (
										<Card key={ e[1] } count={ this.props.user.props.resourceCount[e[0]]} color={ e[1] }>{ adj && adj > 0 ? "+" : ""}{adj}</Card>
									)
								})}
						 	</View>
							<View style={{flexDirection: "row"}} >
						 		{ Object.keys(Globals.devCardsExpanded )
									.map((devCardId) => Object.assign({}, Globals.devCardsExpanded[devCardId], {
										countUsed: this.props.user.props.devUsedCount[devCardId],
										count: this.props.user.props.devCount[devCardId],
										key: devCardId
									}))
									.filter((e) => e.countUsed > 0 || e.count > 0)
									.map((e) => 
									<Card { ...e } 
										onPress={ () => this.props.onPressDevCard(e) }>{e.symbol}</Card>)
								}
						 	</View>
						</View>
				 </View>
    );
  }
}

const nodeDiameter = 20
var styles = StyleSheet.create({
	award: {
		margin: 4, 
		backgroundColor: "whitesmoke", 
		borderRadius: 3, 
		height: 25, width: 90
	},
   description: {
     marginBottom: 20,
     fontSize: 18,
     textAlign: 'center',
     color: '#656565'
   },
   teamName: {
     fontSize: 12,
     textAlign: 'center',
     color: 'black'
   },
   smallStats: {
     fontSize: 12,
     textAlign: 'center',
     color: '#656565'
   },

});

UserAssetsShow.contextTypes = {
	store: React.PropTypes.object,
}

module.exports = UserAssetsShow;