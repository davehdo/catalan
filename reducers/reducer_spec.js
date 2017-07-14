// depends on michael jackson's expect library
// npm install --save expect

// run tests by node reducers/reducer_spec.js 
// using ES6 modules

'use strict';

const expect = require( "expect")
const Reducer = require("./index.js")

// expect = Expect.expect
// import expect, { createSpy, spyOn, isSpy } from 'expect'
// console.log( expect )

function hello() {
	return 1
}

// { game:
//    { players: [ [Object], [Object], [Object] ],
//      round: 0,
//      turn: 0,
//      thisTurnRolled: undefined },
//   map:
//    { hexagonContents:
//       { '0': [Object],
//         '1': [Object],
//         '2': [Object],
//         '3': [Object],
//         '4': [Object],
//         '5': [Object],
//         '6': [Object],
//         '7': [Object],
//         '8': [Object],
//         '9': [Object],
//         '10': [Object],
//         '11': [Object],
//         '12': [Object],
//         '13': [Object],
//         '14': [Object],
//         '15': [Object],
//         '16': [Object],
//         '17': [Object],
//         '18': [Object] },
//      nodeContents: {},
//      edgeContents: {} } }
//
// END_TURN
// ROLL
// { type: "ADJUST_RESOURCES", userId, ORE: _, BRICK: _, LUMBER: _, SHEEP: _, WHEAT: _}
// { type: "BUILD_EDGE", userId: _, edgeId: _ }
// { type: "BUILD_NODE", userId: _, nodeId: _ }


// END_TURN
// console.log( Reducer.resourceCount(undefined, {}))

// ==========================================================================
// ========================  specs for resourceCount  =======================
expect(
	Reducer.resourceCount(undefined, {}).WHEAT
).toEqual( 10 );

expect(
	Reducer.resourceCount({ WHEAT: 10, SHEEP: 10, LUMBER: 10, BRICK: 10, ORE: 10 }, {type: "ADJUST_RESOURCES", WHEAT: -1}).WHEAT
).toEqual( 9 );

expect(
	Reducer.resourceCount({ WHEAT: 10, SHEEP: 10, LUMBER: 10, BRICK: 10, ORE: 10 }, {type: "ADJUST_RESOURCES", WHEAT: 1}).WHEAT
).toEqual( 11 );

expect(
	Reducer.resourceCount({ WHEAT: 10, SHEEP: 10, LUMBER: 10, BRICK: 10, ORE: 10 }, {type: "ADJUST_RESOURCES", WHEAT: undefined}).WHEAT
).toEqual( 10 );


// ==========================================================================
// ===========================  specs for player  ===========================
expect(
	Reducer.player({ 
		id: undefined,
		name: 'Unnamed player',
		color: 'white',
		resourceCount: { WHEAT: 10, SHEEP: 10, LUMBER: 10, BRICK: 10, ORE: 10 } 
	}, {type: "ADJUST_RESOURCES", WHEAT: -1}).resourceCount.WHEAT
).toEqual( 9 )

// ==========================================================================
// ===========================  specs for players  ===========================
expect(
	typeof(Reducer.players(undefined, {}))
).toEqual( "object" )

expect(
	Reducer.players([{ 
		id: undefined,
		name: 'Unnamed player',
		color: 'white',
		resourceCount: { WHEAT: 10, SHEEP: 10, LUMBER: 10, BRICK: 10, ORE: 10 } 
	}], {type: "ADJUST_RESOURCES", WHEAT: -1, userId: undefined})[0].resourceCount.WHEAT
).toEqual( 10 )

expect(
	Reducer.players([{ 
		id: 12,
		name: 'Unnamed player',
		color: 'white',
		resourceCount: { WHEAT: 10, SHEEP: 10, LUMBER: 10, BRICK: 10, ORE: 10 } 
	}], {type: "ADJUST_RESOURCES", WHEAT: -1, userId: 12})[0].resourceCount.WHEAT
).toEqual( 9 )

expect(
	Reducer.players([{ 
		id: 12,
		name: 'Unnamed player',
		color: 'white',
		resourceCount: { WHEAT: 10, SHEEP: 10, LUMBER: 10, BRICK: 10, ORE: 10 } 
	}], {type: "ADJUST_RESOURCES", WHEAT: -1, userId: 13})[0].resourceCount.WHEAT
).toEqual( 10 )

// ==========================================================================
// ========================  specs for edgeContents  ========================
expect(
	typeof(Reducer.edgeContents(undefined, {}))
).toEqual( "object")

expect(
	Reducer.edgeContents({}, {type: "BUILD_EDGE", userId: 99, edgeId: 100})
).toEqual( {100: { userId: 99, road: true } } )

expect(
	Reducer.edgeContents( {100: { userId: 99, road: true } }, {type: "BUILD_EDGE", userId: 99, edgeId: 70})
).toEqual( {100: { userId: 99, road: true }, 70: { userId: 99, road: true } } )



// ==========================================================================
// ========================  specs for nodeContents  ========================
expect(
	typeof(Reducer.nodeContents(undefined, {}))
).toEqual( "object")

expect(
	Reducer.nodeContents({}, {type: "BUILD_NODE", userId: 99, nodeId: 100})
).toEqual( {100: { userId: 99, buildingType: 1 } } )

expect(
	Reducer.nodeContents({100: { userId: 99, buildingType: 1 } }, {type: "BUILD_NODE", userId: 99, nodeId: 70})
).toEqual( {100: { userId: 99, buildingType: 1 }, 70: { userId: 99, buildingType: 1 } } )



// ==========================================================================
// ===========================  specs for map  ===========================

expect(
	typeof(Reducer.map(undefined, {}))
).toEqual( "object" )


// console.log( Reducer.player( undefined, {}))
console.log( "Tests passed ")