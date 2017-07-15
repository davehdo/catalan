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



// ============================================================================
// ===========================  specs for dev count  ============================
expect(
	typeof(Reducer.devCount(undefined, {}))
).toEqual( "object" )


expect(
	Reducer.devCount({ DEV_KNIGHT: 10, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0}, 
		{type: "USE_DEV_CARD", card: "DEV_KNIGHT"}).DEV_KNIGHT
).toEqual( 9 )

expect(
	Reducer.devCount({  DEV_KNIGHT: 0, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0 }, 
		{type: "DRAW_DEV_CARD", userId: 1, rand: 0.001 })
).toEqual({  DEV_KNIGHT: 1, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0 } )

expect(
	Reducer.devCount( undefined, {})
).toEqual({  DEV_KNIGHT: 0, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0 })

expect(
	Reducer.devCount( Reducer.devCount(undefined, {}), {type: "DRAW_DEV_CARD", userId: 1, rand: 0.001 })
).toEqual({  DEV_KNIGHT: 1, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0 })

// ==========================================================================
// ===========================  specs for player  ===========================
expect(
	typeof(Reducer.player(undefined, {}))
).toEqual( "object" )

expect(
	typeof(Reducer.player(undefined, {}).devCount)
).toEqual( "object" )

expect(
	Reducer.player(undefined, {}).id 
).toNotEqual( undefined )

expect(
	Reducer.player({ 
		id: undefined,
		name: 'Unnamed player',
		color: 'white',
		resourceCount: { WHEAT: 10, SHEEP: 10, LUMBER: 10, BRICK: 10, ORE: 10 } 
	}, {type: "ADJUST_RESOURCES", WHEAT: -1}).resourceCount.WHEAT
).toEqual( 9 )
//
expect(
	Reducer.player({
		id: 12,
		name: 'Unnamed player',
		color: 'white',
		devCount: { DEV_KNIGHT: 0, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0},
		devUsedCount: { DEV_KNIGHT: 0, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0},
	}, {type: "DRAW_DEV_CARD", userId: 12, rand: 0.001 }).devCount
).toEqual( { DEV_KNIGHT: 1, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0} )

expect(
	Reducer.player({ 
		id: 12,
		name: 'Unnamed player',
		color: 'white',
		devCount: { DEV_KNIGHT: 10, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0},
		devUsedCount: { DEV_KNIGHT: 0, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0},
	}, {type: "USE_DEV_CARD", userId: 12, card: "DEV_KNIGHT"}).devCount.DEV_KNIGHT
).toEqual( 9 )

expect(
	Reducer.players([{ 
		id: 12987,
		name: 'Unnamed player',
		color: 'white',
		devCount: { DEV_KNIGHT: 10, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0},
		devUsedCount: { DEV_KNIGHT: 0, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0},
	}], {type: "USE_DEV_CARD", userId: 12, card: "DEV_KNIGHT"})[0].devCount.DEV_KNIGHT
).toEqual( 10 )

expect(
	Reducer.player({ 
		id: 12,
		name: 'Unnamed player',
		color: 'white',
		devCount: { DEV_KNIGHT: 10, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0},
		devUsedCount: { DEV_KNIGHT: 0, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0},
	}, {type: "USE_DEV_CARD", userId: 12, card: "DEV_KNIGHT"}).devUsedCount.DEV_KNIGHT
).toEqual( 1 )

// establish normal
expect(
	Reducer.player( Object.assign( Reducer.player(undefined, {id: 123})), {}).devCount
).toEqual( {DEV_KNIGHT: 0, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0} )


expect(
	Reducer.player( Object.assign( Reducer.player(undefined, {}), {id: 123}), {type: "DRAW_DEV_CARD", userId: 123, rand: 0.001}).devCount
).toEqual( {DEV_KNIGHT: 1, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0} )

expect(
	Reducer.player( Object.assign( Reducer.player(undefined, {}), {id: 123}), {type: "DRAW_DEV_CARD", userId: 111, rand: 0.001}).devCount
).toEqual( {DEV_KNIGHT: 0, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0} )


// ============================================================================
// ===========================  specs for players  ============================
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


let playerForPlayersTest1 = Object.assign( Reducer.player(undefined, {}), {id: 123})
expect(
	Reducer.players( [playerForPlayersTest1], {type: "DRAW_DEV_CARD", userId: 123, rand: 0.001})[0].devCount
).toEqual( {DEV_KNIGHT: 1, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0} )


let playerForPlayersTest2 = Object.assign( Reducer.player(undefined, {}), {id: 123})
expect(
	Reducer.players( [playerForPlayersTest2], {type: "DRAW_DEV_CARD", userId: 111, rand: 0.001})[0].devCount
).toEqual( {DEV_KNIGHT: 0, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0} )


// ============================================================================
// =========================  specs for edgeContents  =========================
expect(
	typeof(Reducer.edgeContents(undefined, {}))
).toEqual( "object")

expect(
	Reducer.edgeContents({}, {type: "BUILD_EDGE", userId: 99, edgeId: 100})
).toEqual( {100: { userId: 99, road: true } } )

expect(
	Reducer.edgeContents( {100: { userId: 99, road: true } }, {type: "BUILD_EDGE", userId: 99, edgeId: 70})
).toEqual( {100: { userId: 99, road: true }, 70: { userId: 99, road: true } } )



// ============================================================================
// ==========================  specs for nodeContents  ========================
expect(
	typeof(Reducer.nodeContents(undefined, {}))
).toEqual( "object")

expect(
	Reducer.nodeContents({}, {type: "BUILD_NODE", userId: 99, nodeId: 100})
).toEqual( {100: { userId: 99, buildingType: 1 } } )

expect(
	Reducer.nodeContents({100: { userId: 99, buildingType: 1 } }, {type: "BUILD_NODE", userId: 99, nodeId: 70})
).toEqual( {100: { userId: 99, buildingType: 1 }, 70: { userId: 99, buildingType: 1 } } )


// ============================================================================
// ==========================  specs for hexagonContents  ========================
expect(
	typeof(Reducer.hexagonContents(undefined, {}))
).toEqual( "object")

expect(
	Reducer.hexagonContents({10: {resource: "WHEAT", number: 4, robber: false }}, {type: "MOVE_ROBBER", hexId: 10})
).toEqual( {10: {resource: "WHEAT", number: 4, robber: true }})

expect(
	Reducer.hexagonContents({10: {resource: "WHEAT", number: 4, robber: true }}, {type: "MOVE_ROBBER", hexId: 7})
).toEqual( {10: {resource: "WHEAT", number: 4, robber: false }})




// ============================================================================
// =============================  specs for map  ==============================

expect(
	typeof(Reducer.map(undefined, {}))
).toEqual( "object" )


// ============================================================================
// =============================  specs for game  =============================

expect(
	typeof(Reducer.game(undefined, {}))
).toEqual( "object" )

let playerForGameTest0 = Reducer.player(undefined, {})

expect(
	Reducer.game({players: [ playerForGameTest0 ]}, {type: "ADJUST_RESOURCES", WHEAT: -1, userId: playerForGameTest0.id}).players[0].resourceCount.WHEAT
).toEqual( playerForGameTest0.resourceCount.WHEAT - 1)

let defaultGame = Reducer.game(undefined, {})

expect(
	Reducer.game( Object.assign({}, defaultGame, {requireRobberMove: false }), {type: "REQUIRE_ROBBER_MOVE"}).requireRobberMove
).toEqual( true )

expect(
	Reducer.game( Object.assign({}, defaultGame, {requireRobberMove: true }), {type: "MOVE_ROBBER"}).requireRobberMove
).toEqual( false )

let playerForGameTest1 = Object.assign( Reducer.player(undefined, {}), {id: 123})
let gamePriorForGameTest1 = Object.assign( Reducer.game(undefined, {}), {players: [ playerForGameTest1 ]})
expect(
	Reducer.game( gamePriorForGameTest1, {type: "DRAW_DEV_CARD", userId: 123, rand: 0.001}).players[0].devCount
).toEqual( {DEV_KNIGHT: 1, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0} )

let playerForGameTest2 = Object.assign( Reducer.player(undefined, {}), {id: 123})
let gamePriorForGameTest2 = Object.assign( Reducer.game(undefined, {}), {players: [ playerForGameTest2 ]})
expect(
	Reducer.game( gamePriorForGameTest2, {type: "DRAW_DEV_CARD", userId: 111, rand: 0.001}).players[0].devCount
).toEqual( {DEV_KNIGHT: 0, DEV_VP: 0, DEV_ROAD: 0, DEV_MONOPOLY: 0, DEV_PLENTY: 0} )


// console.log( Reducer.player( undefined, {}))
console.log( "Tests passed ")