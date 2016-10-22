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

	class Maybe {
	    constructor(type, value) {
	        this.type = type;
	        this.value = value;
	        this.unit = this.pure;
	    }
	    static just(val) {
	        if (val === undefined || val === null) {
	            throw new TypeError("You sucker, how did you let this happen!?");
	        }
	        return new Maybe("Just", val);
	    }
	    static nothing() {
	        return new Maybe("Nothing");
	    }
	    static maybe(val) {
	        if (val === undefined || val === null) {
	            return Maybe.nothing();
	        }
	        return Maybe.just(val);
	    }
	    static all(arr, patterns) {
	        let fullOfSomethings = true;
	        let successArgs = arr.map(x => x.do({
	            something(y) {
	                return y;
	            },
	            nothing() {
	                fullOfSomethings = false;
	            }
	        }));
	        if (fullOfSomethings) {
	            return patterns.something(successArgs);
	        } else {
	            return patterns.nothing();
	        }
	    }
	    fmap(fn) {
	        if (this.isSomething()) {
	            return Maybe.maybe(fn(this.value));
	        }
	        return Maybe.nothing();
	    }
	    appl(fn) {
	        if (fn.isNothing) {
	            throw new TypeError("blow the fuk up");
	        }
	        return this.fmap(fn.unwrap());
	    }
	    pure(val) {
	        return Maybe.maybe(val);
	    }
	    bind(fn) {
	        return fn(this.value);
	    }
	    isNothing() {
	        return this.value === undefined || this.value === null;
	    }
	    isSomething() {
	        return !this.isNothing();
	    }
	    unwrap() {
	        if (this.isNothing() || this.value === undefined) {
	            throw new TypeError("come on you guyyyzz");
	        }
	        return this.value;
	    }
	    do(patterns) {
	        if (this.isSomething()) {
	            return patterns.something(this.value);
	        }
	        return patterns.nothing();
	    }
	    withDefault(fallback) {
	        return this.isSomething() ? this.unwrap() : fallback;
	    }
	}
	exports.Maybe = Maybe;

/***/ }
/******/ ]);