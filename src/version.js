/* jshint esversion: 6, curly: true, eqeqeq: true, forin: true */

/***********************************************************************************
* Title: Hamsters.js                                                               *
* Description: 100% Vanilla Javascript Multithreading & Parallel Execution Library *
* Author: Austin K. Smith                                                          *
* Contact: austin@asmithdev.com                                                    *  
* Copyright: 2015 Austin K. Smith - austin@asmithdev.com                           * 
* License: Artistic License 2.0                                                    *
***********************************************************************************/

'use strict';

export default class version {

	constructor() {
		this.majorVersion = 5;
		this.minorVersion = 1;
		this.patchVersion = 3;
	}

	current() {
		return `${majorVersion}.${minorVersion}.${patchVersion}`;
	}
}