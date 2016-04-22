import {getTypeFromOption} from "./lib/postcss"
import * as _ from "underscore"

// const B = "B"
// let a = ["a","b"]
// console.log(
// 	_.map( a, _.partial(getA, _, B) ) 
// )
// console.log(
// 	_.map( a, partial(flip(getA)) )
// )

// function getA(a, b) {
// 	console.log("a: %s and b: %s", a,b)
// 	return a === "a" && b === "B" && a
// }

// function partial(f, ...args) {
// 	return f.bind(null, ...args)
// }
let tuples = [ ['-d', '--dir'] ]
let p1 = ['-d', 'one/path', 'two/path']
let p2 = ['one/path', '--dir', 'two/path']
let p3 = []
let p4 = ['one/path', '--dir', 'two/path', '-d', 'one/path']

const getParameters = (map, lookup) => {
	const product = map.map( (Sn, n) =>  {
		const i = lookup.indexOf(Sn)
		return i > -1 && [lookup[i], lookup[i+1]]
	})
	return product
	//return isEmpty(product) && null || product
}
// console.log(
	// getParameter(tuples, p1),
	// getParameter(tuples, p2),
	// getParameter(tuples, p3),
	// getParameter(tuples, p4)
// )
console.log("%j \n",
	intersectTupleWith(getParameters, tuples, p1)
)
console.log("%j \n",
	intersectTupleWith(getParameters, tuples, p2)
)
console.log("%j \n",
	intersectTupleWith(getParameters, tuples, p3)
)
console.log("%j \n",
	intersectTupleWith(getParameters, tuples, p4)
)

function intersectTupleWith(f, tupleSet, set) {
	return tupleSet.map(Sn => intersectWith(f, Sn, set))[0]
}
function intersectWith(f, ...sets) {
	const lookup = longest(...sets)
	const map = shortest(...sets)
	console.log("longest", lookup)
	console.log("shortest", map)
	return f(map, lookup).filter(isNotEmpty)
}

function longest(...lists) {
	return _.max( [...lists], list => list.length )
}
function shortest(...lists) {
	return _.min( [...lists], list => list.length )
}
/** isEmpty :: [a] -> Bool */
function isEmpty(array) { return array.length === 0 }
/** isNotEmpty :: [a] -> Bool */
function isNotEmpty(a) { return !isEmpty(a)}



/**********************************************/

function getParameter(search, param) {
	return mapReduce(search, t => {
		const i = param.indexOf(t)
		return i > -1 && [param[i], param[i+1]] 
	})[0]
}

function flip(f) { return (b,a) => f(a,b) }

function mapReduce(xs, f) {
	return xs.map(x => x.reduce((s1, s2) => f(s1) || f(s2) ))
}

// console.log(getTypeFromOption(["-d", "etDir", "etOutPutDir"]))

// console.log(getTypeFromOption(["-d", "etDir", "etOutPutDir", "-d", "et forkert output"]))