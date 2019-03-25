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

export default class legacy {

  /**
  * @constructor
  * @function constructor - Sets properties for this class
  */
  constructor() {
    this.run = this.legacyScaffold;
  }

  /**
  * @function legacyScaffold - Provides library functionality for legacy devices
  */
  legacyScaffold(params, resolve) {
    setTimeout(() => {
      if(typeof self === 'undefined') {
        var self = (global || window || this);
      }
      self.params = params;
      self.rtn = {
        data: []
      };
      params.hamstersJob();
      resolve(rtn);
    }, 4); //4ms delay (HTML5 spec minimum), simulate threading
  }
};