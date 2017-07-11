'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
	TouchableOpacity,
	Button
} from 'react-native';

const WorldMap = require('./WorldMap');
const MapHeight = 300

class NodeShow extends Component {
	constructor(props) {
	  super(props);
	  this.state = { };
	}
	
	buildSettlement() {
		this.props.node.contents = 1
			// ownedByUser
		
	}
	
	buildCity() {
		this.props.node.contents = 2
			// ownedByUser
		
	}
	
  render() {

    return (
		<View style={styles.container}>
			<Text style={styles.description}>
				{ this.props.node.displayContents() } { this.props.node.index }
			</Text>


			<View style={{ backgroundColor: "whitesmoke", flexDirection: "row"}}>
				<View style={{flex: 1 }}></View>

				<View style={{flex: 1, marginTop: MapHeight / 2, height: MapHeight / 2 }}>
					<View transform={[{scaleX: 0.3}, {scaleY: 0.3}, 
						{translateX: -200 * this.props.node.coordinates.x }, 
						{translateY: 200 * this.props.node.coordinates.y }]} style={{ position: "absolute"}}>		

					{ this.props.node.hexagons.map((h) => h.render())}
				 	{ this.props.node.edges.map((h) => h.render())}
					{ this.props.node.hexagons.map((h) => h.nodes.map((n) => n.render() ))}
					
					</View>
				</View>
			</View>

			<View style={{ flexDirection: "column", justifyContent: "flex-start"}}>
				 <Button
				   onPress={() => this.buildSettlement()}
				   title="Build a settlement"
				   color="#841584"
				   accessibilityLabel="Learn more about this purple button"
				 />
					
				 <Button
				   onPress={() => this.buildCity()}
				   title="Build a city"
				   color="#841584"
				   accessibilityLabel="Learn more about this purple button"
				 />
					
			</View>

		</View>
    );
  }
}

var styles = StyleSheet.create({
	button: {
		borderColor: "black",
		// flex: 1,
		padding: 10,
		flexDirection: "column",
		backgroundColor: "blue"
	},
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
	  // flex: 1,
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  }
  
  
});

module.exports = NodeShow;