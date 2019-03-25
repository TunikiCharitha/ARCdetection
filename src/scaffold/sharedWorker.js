/* jshint esversion: 6, curly: true, eqeqeq: true, forin: true */

/***********************************************************************************
* Title: Hamsters.js                                                               *
* Description: 100% Vanilla Javascript Multithreading & Parallel Execution Library *
* Author: Austin K. Smith                                                          *
* Contact: austin@asmithdev.com                                                    *  
* Copyright: 2015 Austin K. Smith - austin@asmithdev.com                           * 
* License: Artistic License 2.0                                                    *
***********************************************************************************/

(function() {

  'use strict';

  if(typeof self === 'undefined') {
    self = (global || window || this);
  }

  self.params = {};
  self.rtn = {};

  addEventListener('connect', (incomingConnection) => {
    const port = incomingConnection.ports[0];
    port.start();
    port.addEventListener('message', (incomingMessage) => {
      params = incomingMessage.data;
      rtn = {
        data: [],
        dataType: params.dataType
      };
      if(params.importScripts) {
        self.importScripts(params.importScripts);
      }
      eval("(" + params.hamstersJob + ")")();
      port.postMessage(rtn);
    }, false);
  }, false);
}());