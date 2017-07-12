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
const Edge = require('./Edge');
const Node = require('./Node');
const Hexagon = require('./Hexagon');
const MapHeight = 260
const UserAssetsShow = require("./UserAssetsShow.js")


class NodeShow extends Component {
	constructor(props) {
		super(props); // props include turnOfUser and node
	  this.state = {
		  message: undefined,
		  edges: this.props.node.adjacentEdges,
		  hexagons: this.props.node.adjacentHexagons,
		  nodes: [] 
	  };
	  

	  this.state.hexagons.map((h) => {
  		  h.adjacentNodes.map((n) => {
  			  if (this.state.nodes.indexOf( n ) == -1) {
  				  this.state.nodes.push(n)
  			  }
  		  })
	  })

	}
	
	commonObstacleToBuilding() {
		// if its not your turn
		if (false) {
			return true
		} else if (false) {
		// if you have not rolled yet
			return true
		} else if (this.props.node.state.contents >= 1 && this.props.node.state.ownedByUser != this.props.game.state.turnOfUser) {
		// if already a building there
			this.setState({message: "Cannot build on someone else's property!"})
		} else if (this.props.node.adjacentNodes.filter((n) => n && n.state.contents ).length > 0) {
		// if too close to others
			this.setState({message: "Cannot build too close to others!"})
			return true
		} else if (false) {
		// if not affordable 
			return true
		} else {
			return false
		}
	}
	
	buildSettlement() {
		// if its not your turn
		if (this.commonObstacleToBuilding()) {
			//
		} else if (this.props.node.state.contents) {
		// if already a building there
			this.setState({message: "Cannot build where another building already exists!"})
		} else if (false) {
		// if none of my settlement pieces remain
					
		} else {
			this.props.node.setState({
				contents: 1,
				ownedByUser: this.props.game.state.turnOfUser
			}) 

			
			// this.props.node.state.contents = 1
			// this.props.node.state.ownedByUser = this.props.game.state.turnOfUser
			this.setState({message: "Settlement built!"})	// ownedByUser
			
		}
		
	}
	
	buildCity() {
		// if its not your turn
		if (this.commonObstacleToBuilding()) {
			//
		} else if (this.props.node.state.contents >= 2) {
		// if already a building there
			this.setState({message: "Cannot build where another city already exists!"})
		} else if (this.props.node.state.contents < 1) {
		// if already a building there
			this.setState({message: "Can only build a city on top of existing settlement!"})
		} else if (false) {
		// if none of my city pieces remain
					
		} else {
			this.props.node.state.contents = 2
			this.props.node.state.ownedByUser = this.props.game.state.turnOfUser
			this.setState({message: "City built!"})	// ownedByUser
		}
		
	}
	
  render() {

	//  	
	// 						

						// 
						// 
	
    return (
		<View style={styles.container}>
			<Text style={styles.description}>
				{ this.props.node.displayContents() } { this.props.node.props.index }{"\n"}
				{ this.props.node.state.ownedByUser ? `Owned by ${this.props.node.state.ownedByUser.state.name}` : ""}
			</Text>
			<Text style={styles.description}>
				{ this.state.message }
			</Text>


			<View style={{ backgroundColor: "whitesmoke", margin: 30, flexDirection: "row"}}>
				<View style={{flex: 1 }}></View>

				<View style={{flex: 1, marginTop: MapHeight / 2, height: MapHeight / 2 }}>
					<View transform={[{scaleX: 0.3}, {scaleY: 0.3}, 
						{translateX: -200 * this.props.node.coordinates.x }, 
						{translateY: 200 * this.props.node.coordinates.y }]} style={{ position: "absolute"}}>		

						{ this.state.hexagons.map((h) =>  <Hexagon key={`h_${h.props.index}` } { ...h.props } /> )}
						{ this.state.edges.map((h) => <Edge key={`e_${h.props.index}`} {...h.props} />  )}
						{ this.state.nodes.map((h) => <Node key={`n_${h.props.index}`} {...h.props} />  )}

					</View>
				</View>
			</View>

		 	<UserAssetsShow user={ this.props.game.state.signedInUser }/>

			<View style={{ flexDirection: "row", justifyContent: "flex-start"}}>
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
    padding: 0,
    marginTop: 65,
    alignItems: 'center'
  }
  
  
});

module.exports = NodeShow;