// this.edgeIds = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140,
// 	150, 160, 170, 180, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 111, 121,
// 	131, 141, 151, 161, 171, 181, 2, 12, 22, 32, 42, 52, 62, 72, 82, 92, 102,
// 	112, 122, 132, 142, 152, 162, 172, 182,   -40, -50, -60, -70, -80,
// 	-11, -21, -31, -41, -51,   -12, -22, -162, -172, -182]
//
//
// // ==========================  produce the nodes  ==========================
//
// this.nodeIds = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140,
// 	150, 160, 170, 180, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 111, 121,
// 	131, 141, 151, 161, 171, 181,   -40, -50, -60, -70, -80, -90, -100, -110,
// 	-11, -21, -31, -41, -51, -61, -71, -81]
//
//
// let hexIds = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
//
// this.hexagons = hexIds.map((h) => new Hexagon({index: h}))
//
// this.edges = this.edgeIds.map((h) => new Edge({index: h}))
//
// this.nodes = this.nodeIds.map((h) => new Node({index: h}))
//
// console.log( JSON.stringify(
// 	this.hexagons.map((o) => {
// 		return {
// 			index: o.props.index,
// 			...o.coordinates,
// 			adjNodes: this.nodesWithinRadius( o, 1 / Math.sqrt(3) ).map( (e) => e.props.index ),
// 			adjEdges: this.edgesWithinRadius( o, 0.5 ).map( (e) => e.props.index ),
// 		}
// 	})
//
// ))
//
//
// console.log( JSON.stringify(
// 	this.edges.map((o) => {
// 		return {
// 			index: o.props.index,
// 			...o.coordinates,
// 			adjNodes: this.nodesWithinRadius( o, 0.5 / Math.sqrt(3) ).map( (e) => e.props.index ),
// 			adjEdges: this.edgesWithinRadius( o, 0.5 ).map( (e) => e.props.index ),
// 			adjHexagons: this.hexagonsWithinRadius( o, 0.5 ).map( (e) => e.props.index ),
// 		}
// 	})
// ))
//
//
// console.log( JSON.stringify(
// 	this.nodes.map((o) => {
// 		return {
// 			index: o.props.index,
// 			...o.coordinates,
// 			adjNodes: this.nodesWithinRadius( o, 1 / Math.sqrt(3) ).map( (e) => e.props.index ),
// 			adjEdges: this.edgesWithinRadius( o, 0.5 / Math.sqrt(3) ).map( (e) => e.props.index ),
// 			adjHexagons: this.hexagonsWithinRadius( o,1 / Math.sqrt(3) ).map( (e) => e.props.index ),
// 		}
// 	})
// ))