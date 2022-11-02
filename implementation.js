'use strict';

var ArraySpeciesCreate = require('es-abstract/2022/ArraySpeciesCreate');
var Call = require('es-abstract/2022/Call');
var CreateDataPropertyOrThrow = require('es-abstract/2022/CreateDataPropertyOrThrow');
var Get = require('es-abstract/2022/Get');
var HasProperty = require('es-abstract/2022/HasProperty');
var IsCallable = require('es-abstract/2022/IsCallable');
var LengthOfArrayLike = require('es-abstract/2022/LengthOfArrayLike');
var ToBoolean = require('es-abstract/2022/ToBoolean');
var ToObject = require('es-abstract/2022/ToObject');
var ToString = require('es-abstract/2022/ToString');
var callBound = require('call-bind/callBound');
var isString = require('is-string');

// Check failure of by-index access of string characters (IE < 9) and failure of `0 in boxedString` (Rhino)
var boxedString = Object('a');
var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

var strSplit = callBound('String.prototype.split');

module.exports = function filter(callbackfn) {
	var O = ToObject(this);
	var self = splitString && isString(O) ? strSplit(O, '') : O;
	var len = LengthOfArrayLike(self);

	// If no callback function or if callback is not a callable function
	if (!IsCallable(callbackfn)) {
		throw new TypeError('Array.prototype.filter callback must be a function');
	}

	var thisArg;
	if (arguments.length > 1) {
		thisArg = arguments[1];
	}

	var A = ArraySpeciesCreate(O, 0);
	var k = 0;
	var to = 0;

	while (k < len) {
		var Pk = ToString(k);
		var kPresent = HasProperty(O, Pk);
		if (kPresent) {
			var kValue = Get(O, Pk);
			var selected = ToBoolean(Call(callbackfn, thisArg, [kValue, k, O]));
			if (selected) {
				CreateDataPropertyOrThrow(A, ToString(to), kValue);
				to += 1;
			}
		}
		k += 1;
	}

	return A;
};
