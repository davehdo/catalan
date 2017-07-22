'use strict';

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Button,
	ListView,
	ScrollView
} from 'react-native';

const GameHome = require('./GameHome');
// const User = require('./User.js');
// const Globals = require("./Globals.js")
// const UserAssetsShow = require("./UserAssetsShow.js")
// const DevCardShow = require("./DevCardShow.js")
// const DevCardPlentyShow = require("./DevCardPlentyShow.js")
// const TradeShow = require("./TradeShow.js")
// const Card = require("./Card.js")
//
//


class GamesIndex extends Component {
	constructor(props) {
		super(props);

		this.state = {
			message: undefined // not quite relevant to the nonactive users--personalize this?
		};
		
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		
		this.state = {
			dataSource: ds.cloneWithRows([
				{id: "1234a", key: "1234a", name: 'Game 1'},
				{id: "1234b", key: "1234b", name: 'Game 2'},
				{id: "1234b", key: "1234b", name: 'Game 3'},
			]),
		};
	}

	componentDidMount() {
		const { store } = this.context
		this.unsubscribe = store.subscribe(() =>
			this.forceUpdate()
		)
	}
	
	componentWillUnmount() {
		this.unsubscribe()
	}
	
	showGame( id ) {
		this.props.navigator.push({
			title: 'Catalan',
			component: GameHome,
			passProps: {}
		});		
	}
	
  render() {
	  // const store = this.context.store
	  // let state = this.context.store.getState()
	  // for now we treat the interface as if its whichever user owns the turn, but eventually will change this to signedIn
	  // let user = User.withTurn({store: this.context.store})
	  
    return (
		<View style={styles.container}>
			<Text style={{ fontSize: 18, padding: 20, textAlign: "center" }}>Choose a game</Text>
			 
			<ScrollView contentContainerStyle={{ top: -60 }}>
		     <ListView
		       dataSource={this.state.dataSource}
		       renderRow={(rowData) => <TouchableOpacity onPress={() => { this.showGame( 0 ) }} style={ styles.listItem }>
					 <Text>{rowData.name}</Text>
					 <Text>In Progress</Text>
					 <Text>Players: Bob, Jim, Jack</Text>
				 </TouchableOpacity>}
		     />
			</ScrollView>
				 
			<View style={{ flexDirection: "row", justifyContent: "center", backgroundColor: "black", padding: 10}}>
					<Button title="Create new game" 
				 		color="white"
				 		onPress={() => {}}><Text>Create new game</Text>
				 	</Button>
			</View>
      </View>
    );
  }
}

// allows us to access store as this.context.store
GamesIndex.contextTypes = {
	store: React.PropTypes.object,
}

var styles = StyleSheet.create({
   description: {
     fontSize: 16,
     textAlign: 'center',
     color: '#656565'
   },
	listItem: {
		borderBottomColor: '#bbb', 
		borderBottomWidth: StyleSheet.hairlineWidth, 
		backgroundColor: "whitesmoke", 
		padding: 18	
	},
   message: {

     fontSize: 16,
     textAlign: 'center',
     color: 'blue'
   },
   smallStats: {

     fontSize: 12,
     textAlign: 'center',
     color: '#656565'
   },
  container: {
	 flex: 1,
    // padding: 10,
    marginTop: 65, // to offset the nav at the top
    alignItems: 'stretch', // stretches to 100% width (cross-axis)
	 backgroundColor: "tan"
  }
});

module.exports = GamesIndex;