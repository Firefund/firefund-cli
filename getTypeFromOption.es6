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
const flagsShort = ["-r","-d","-o"]
const flagsLong = ["--replace","--dir","--output"]
const tuples =  _.zip(flagsShort, flagsLong) //[ ['-d', '--dir'] ]
let p1 = ['-d', 'one/path', 'two/path']
let p2 = ['one/path', '--dir', 'two/path']
let p3 = []
let p4 = ['one/path', '--dir', 'two/path', '-d', 'one/path']
let p5 = ['one/path', '--dir', 'two/path', '-d', 'one/path', '-d']

const getParameters = (map, lookup) => {
	const product = map.map( (flag, n) =>  {
		const i = lookup.indexOf(flag)
		const Pn = i > -1 && [lookup[i], lookup[i+1]] 
		// console.log("flag", flag)
		console.log("Pn", lookup[n])
		return Pn
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
/*console.log("%j \n",
	intersectionTupleWith(getParameters, tuples, p1)
)*/
/*console.log("%j \n",
	intersectionTupleWith(getParameters, tuples, p2)
)
console.log("%j \n",
	intersectionTupleWith(getParameters, tuples, p3)
)
console.log("%j \n",
	intersectionTupleWith(getParameters, tuples, p4)
)*/

function tuplesIntersectionParametersPlusNextP(P, S) {
	const Ps = [];
	P.forEach(	(Pn, n) => {
		S.forEach(Sn => {
			Sn.forEach(flag => {
				if(flag===Pn) Ps.push(Pn, P[n+1])
				//console.log(Sn,Pn,Sn==Pn);
			})
		})
	})
	return Ps;
}


function parse(cmd, flags, idx = 0, acc = []) {
	if (idx + 1 >= cmd.length) return acc;

	if (elementInNestedLists(cmd[idx], flags)) {
		acc.push(cmd[idx], cmd[idx + 1]);
		return parse(cmd, flags, idx + 2, acc);
	}
	return parse(cmd, flags, idx + 1, acc);
}

function elementInNestedLists(e, l) {
	if (l instanceof Array) {
		for (let elem of l) {
			if (elementInNestedLists(e, elem)) {
				return true;
			}
		}
		return false;
	} else {
		return l === e;
	}
}

/** isEmpty :: [a] -> Bool */
function isEmpty(array) { return array.length === 0 }
/** isNotEmpty :: [a] -> Bool */
function isNotEmpty(a) { return !isEmpty(a)}

let Ps = tuplesIntersectionParametersPlusNextP(p1, tuples) 
console.log(
	parse(p1, tuples),
	Ps
)
Ps = tuplesIntersectionParametersPlusNextP(p2, tuples)
console.log(
	parse(p2, tuples),
	Ps
)
Ps = tuplesIntersectionParametersPlusNextP(p3, tuples)
console.log(
	parse(p3, tuples),
	Ps
)
Ps = tuplesIntersectionParametersPlusNextP(p4, tuples)
console.log(
	parse(p4, tuples),
	Ps
)

function intersectionTupleWith(f, tupleSet, set) {
	console.log("S", tupleSet)
	return tupleSet.map(Sn => intersectionWith(f, Sn, set))
		
}
function intersectionWith(f, ...sets) {
	const lookup = longest(...sets)
	const map = shortest(...sets)
	console.log("Sn", map)
	console.log("P", lookup)
	return f(map, lookup).filter(isNotEmpty)
}

function longest(...lists) {
	return _.max( [...lists], list => list.length )
}
function shortest(...lists) {
	return _.min( [...lists], list => list.length )
}

function identity(x) { return x }


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