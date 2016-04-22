"use strict";

var _postcss = require("./lib/postcss");

var _underscore = require("underscore");

var _ = _interopRequireWildcard(_underscore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
var tuples = [['-d', '--dir']];
var p1 = ['-d', 'one/path', 'two/path'];
var p2 = ['one/path', '--dir', 'two/path'];
var p3 = [];
var p4 = ['one/path', '--dir', 'two/path', '-d', 'one/path'];

var getParameters = function getParameters(map, lookup) {
	var product = map.map(function (Sn, n) {
		var i = lookup.indexOf(Sn);
		return i > -1 && [lookup[i], lookup[i + 1]];
	});
	return product;
	//return isEmpty(product) && null || product
};
// console.log(
// getParameter(tuples, p1),
// getParameter(tuples, p2),
// getParameter(tuples, p3),
// getParameter(tuples, p4)
// )
console.log("%j \n", intersectTupleWith(getParameters, tuples, p1));
console.log("%j \n", intersectTupleWith(getParameters, tuples, p2));
console.log("%j \n", intersectTupleWith(getParameters, tuples, p3));
console.log("%j \n", intersectTupleWith(getParameters, tuples, p4));

function intersectTupleWith(f, tupleSet, set) {
	return tupleSet.map(function (Sn) {
		return intersectWith(f, Sn, set);
	})[0];
}
function intersectWith(f) {
	for (var _len = arguments.length, sets = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		sets[_key - 1] = arguments[_key];
	}

	var lookup = longest.apply(undefined, sets);
	var map = shortest.apply(undefined, sets);
	console.log("longest", lookup);
	console.log("shortest", map);
	return f(map, lookup).filter(isNotEmpty);
}

function longest() {
	for (var _len2 = arguments.length, lists = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		lists[_key2] = arguments[_key2];
	}

	return _.max([].concat(lists), function (list) {
		return list.length;
	});
}
function shortest() {
	for (var _len3 = arguments.length, lists = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
		lists[_key3] = arguments[_key3];
	}

	return _.min([].concat(lists), function (list) {
		return list.length;
	});
}
/** isEmpty :: [a] -> Bool */
function isEmpty(array) {
	return array.length === 0;
}
/** isNotEmpty :: [a] -> Bool */
function isNotEmpty(a) {
	return !isEmpty(a);
}

/**********************************************/

function getParameter(search, param) {
	return mapReduce(search, function (t) {
		var i = param.indexOf(t);
		return i > -1 && [param[i], param[i + 1]];
	})[0];
}

function flip(f) {
	return function (b, a) {
		return f(a, b);
	};
}

function mapReduce(xs, f) {
	return xs.map(function (x) {
		return x.reduce(function (s1, s2) {
			return f(s1) || f(s2);
		});
	});
}

// console.log(getTypeFromOption(["-d", "etDir", "etOutPutDir"]))

// console.log(getTypeFromOption(["-d", "etDir", "etOutPutDir", "-d", "et forkert output"]))
