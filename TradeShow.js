'use strict';

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Button,
	Picker
} from 'react-native';

const Globals = require("./Globals.js")
const UserAssetsShow = require("./UserAssetsShow.js")
const Card = require("./Card.js")

class TradeShow extends Component {
	constructor(props) {
		super(props);

		this.state = {
			message: undefined, // not quite relevant to the nonactive users--personalize this?
			cost: undefined,
			benefit: undefined
		};		
	}

  render() {
// <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//  	<Card { ...this.props.card } width={ 280 }>
//  		<Text style={styles.heading}>{ this.props.card.name }</Text>{ "\n"}
// 		<Text style={styles.description}>{ this.props.card.description }</Text>
// 	</Card>
// </View>

	  
    return (
		<View style={styles.container}>
			<Text style={styles.message}>{ this.state.message ? `\n${this.state.message}` : ""}</Text>
		 
			<View style={{ flex: 1, flexDirection: "row" }}> 
		 		<View style={{ flex: 1}}>
		 			<Text style={ styles.heading } >Give up</Text>
					 <Picker selectedValue={ this.state.cost } onValueChange={(i) => this.setState({cost: i})}>
			 		<Picker.Item key={"undef"} label={`Choose one`} value={undefined} />
		 			{ Object.keys( Globals.resourcesExpanded )
							.filter((k) => Globals.resourcesExpanded[k].hasCard )
							.filter((k) => (this.props.user.props.resourceCount[k] || 0) >= 4 )
							.map((k) =>
						
					 	<Picker.Item key={k} label={`${k} x 4`} value={`${k}`} />
					 ) }
					 </Picker>
		 
		 		</View>
		 		<View style={{ flex: 1}}>
					 <Text style={ styles.heading } >Receive</Text>
					 <Picker selectedValue={ this.state.benefit } onValueChange={(i) => this.setState({benefit: i})}>
					 <Picker.Item key={"undef"} label={`Choose one`} value={undefined} />
					 { Object.keys( Globals.resourcesExpanded )
							.filter((k) => Globals.resourcesExpanded[k].hasCard )
						 	.map((k) =>
					 	<Picker.Item key={k} label={`${k} x 1`} value={`${k}`} />
					 ) }
					 </Picker>
		 
		 		</View>

			</View>
			
			<UserAssetsShow user={ this.props.user } onPressDevCard={ (c) => {} }/>
			
			
 			<View style={{ flexDirection: "row", justifyContent: "center", backgroundColor: "black", padding: 10}}>
 				 <Button
 				   onPress={() => this.setState({message: this.props.onFinalizeTrade({cost: this.state.cost, benefit: this.state.benefit})})}
 				   title="Finalize Trade"
 				   color="white"
 				   accessibilityLabel="Learn more about this purple button"
 				 />
 			</View>
						 
      </View>
    );
  }
}

 
var styles = StyleSheet.create({
   heading: {
     fontSize: 16 * 1.4,
     textAlign: 'center',
     // color: 'white',
		// marginBottom: 8
   },   
	description: {
     fontSize: 16,
     textAlign: 'center',
     color: 'whitesmoke'
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

module.exports = TradeShow;