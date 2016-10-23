/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Maybe = exports.Maybe = function () {
	    function Maybe(type, value) {
	        _classCallCheck(this, Maybe);

	        this.type = type;
	        this.value = value;
	        this.unit = this.pure;
	    }

	    _createClass(Maybe, [{
	        key: "fmap",
	        value: function fmap(fn) {

                if (this.isSomething()) { return Maybe.maybe(fn(this.value));
	            }
	            return Maybe.nothing();
	        }
	    }, {
	        key: "appl",
	        value: function appl(fn) {
	            if (fn.isNothing) {
	                throw new TypeError("blow the fuk up");
	            }
	            return this.fmap(fn.unwrap());
	        }
	    }, {
	        key: "pure",
	        value: function pure(val) {
	            return Maybe.maybe(val);
	        }
	    }, {
	        key: "bind",
	        value: function bind(fn) {
	            return fn(this.value);
	        }
	    }, {
	        key: "isNothing",
	        value: function isNothing() {
	            return this.value === undefined || this.value === null;
	        }
	    }, {
	        key: "isSomething",
	        value: function isSomething() {
	            return !this.isNothing();
	        }
	    }, {
	        key: "unwrap",
	        value: function unwrap() {
	            if (this.isNothing() || this.value === undefined) {
	                throw new TypeError("come on you guyyyzz");
	            }
	            return this.value;
	        }
	    }, {
	        key: "do",
	        value: function _do(patterns) {
	            if (this.isSomething()) {
	                return patterns.something(this.value);
	            }
	            return patterns.nothing();
	        }
	    }, {
	        key: "withDefault",
	        value: function withDefault(fallback) {
	            return this.isSomething() ? this.unwrap() : fallback;
	        }
	    }], [{
	        key: "just",
	        value: function just(val) {
	            if (val === undefined || val === null) {
	                throw new TypeError("You sucker, how did you let this happen!?");
	            }
	            return new Maybe("Just", val);
	        }
	    }, {
	        key: "nothing",
	        value: function nothing() {
	            return new Maybe("Nothing");
	        }
	    }, {
	        key: "maybe",
	        value: function maybe(val) {
	            if (val === undefined || val === null) {
	                return Maybe.nothing();
	            }
	            return Maybe.just(val);
	        }
	    }, {
	        key: "all",
	        value: function all(arr, patterns) {
	            var fullOfSomethings = true;
	            var successArgs = arr.map(function (x) {
	                return x.do({
	                    something: function something(y) {
	                        return y;
	                    },
	                    nothing: function nothing() {
	                        fullOfSomethings = false;
	                    }
	                });
	            });
	            if (fullOfSomethings) {
	                return patterns.something(successArgs);
	            } else {
	                return patterns.nothing();
	            }
	        }
	    }]);

	    return Maybe;
	}();

/***/ }
/******/ ]);
