'use strict';

import React, { Component } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	// StyleSheet
} from 'react-native';

const Card = ({color, children, count, countUsed, onPress, width = 33 }) => {
	let nodeDiameter = 10 * width / 33 
	if (nodeDiameter < 16) 
		nodeDiameter = 16
		
	const styles = {
		cardOuter: {
			margin: nodeDiameter / 3, 
			backgroundColor: "whitesmoke", 
			padding: 5.5 * width / 33, 
			borderRadius: 2.5 * width / 33, 
			height: 45 * width / 33, width: width
		},
		cardInner: { backgroundColor: color, 
			flex: 1, 
			borderRadius: 1 * width / 33, 
			justifyContent: "center", 
			alignItems: "center",
			padding: 1 * width / 33,
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
	}	

	return <TouchableOpacity onPress={ onPress }>
				<View style={ styles.cardOuter }>
					<View style={ styles.cardInner }>
						<Text style={{ fontSize: 8, color: "white"}}>{ children }</Text>
					</View>
		 		</View>
				<View style={styles.bottomRightCircle}>
					<Text style={{ backgroundColor: "transparent", color: "white", fontSize: 10 / 16 * nodeDiameter }}>{ count }</Text>
				</View>
				{ countUsed ? <View style={styles.upperLeftCircle}>
					<Text style={{ backgroundColor: "transparent", color: "white", fontSize: 10 / 16 * nodeDiameter }}>{ countUsed }</Text>
				</View> : <View />}
			</TouchableOpacity>
}

module.exports = Card



