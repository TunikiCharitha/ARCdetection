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

import version from './version';
import habitat from './habitat';
import pool from './pool';
import queue from './queue';
import data from './data';
import task from './task';
import logger from './logger';

export default class hamstersjs {

  /**
  * @constructor
  * @function constructor - Sets properties for this class
  */
  constructor() {
    this.version = version.current();
    this.maxThreads = habitat.logicalThreads;
    this.habitat = habitat;
    this.data = data;
    this.pool = pool;
    this.logger = logger;
    this.run = this.runTaskUsingCallback;
    this.promise = this.runTaskUsingPromise;
    this.init = this.initializeLibrary;
  }

  /**
  * @function initializeLibrary - Prepares & initializes Hamsters.js library
  * @param {object} startOptions - Provided library functionality options
  */
  initializeLibrary(startOptions) {
    if (typeof startOptions !== 'undefined') {
      this.processStartOptions(startOptions);
    }
    if(!this.habitat.legacy && this.habitat.persistence === true) {
      pool.spawnHamsters(this.maxThreads);
    }
    logger.info(`Initialized using up to ${this.maxThreads} threads.`);
    delete this.init;
  }

  /**
  * @function processStartOptions - Adjusts library functionality based on provided options
  * @param {object} startOptions - Provided library functionality options
  */
  processStartOptions(startOptions) {
    // Add options to override library environment behavior
    let habitatKeys = [
      'worker', 'sharedworker',
      'legacy', 'webworker',
      'reactnative', 'atomics',
      'proxies', 'transferrable',
      'browser', 'shell', 
      'node', 'debug',
      'persistence', 'importscripts'
    ];
    let key = null;
    for (key of Object.keys(startOptions)) {
      if (habitatKeys.indexOf(key.toLowerCase()) !== -1) {
        this.habitat[key] = startOptions[key];
      } else {
        this[key] = startOptions[key];
      }
    }
    // Ensure legacy mode is disabled when we pass a third party worker library
    if(typeof this.habitat.Worker === 'function' && startOptions['legacy'] !== true) {
      this.habitat.legacy = false;
    }
  }


  /**
  * @async
  * @function hamstersPromise - Calls library functionality using async promises
  * @param {object} params - Provided library execution options
  * @param {function} functionToRun - Function to execute
  * @return {array} Results from functionToRun.
  */
  runTaskUsingPromise(params, functionToRun) {
    return new Promise((resolve, reject) => {
      let task = new task(params, functionToRun, this, resolve, reject);
      pool.scheduleTask(task, this).then((results) => {
        task.onSuccess(results);
      }).catch((error) => {
        logger.error(error.message, task.onError);
      });
    });
  }

  /**
  * @async
  * @function hamstersRun - Calls library functionality using async callbacks
  * @param {object} params - Provided library execution options
  * @param {function} functionToRun - Function to execute
  * @param {function} onSuccess - Function to call upon successful execution
  * @param {function} onError - Function to call upon execution failure
  * @return {array} Results from functionToRun.
  */
  runTaskUsingCallback(params, functionToRun, onSuccess, onError) {
    let task = new task(params, functionToRun, this, onSuccess, onError);
    pool.scheduleTask(task, this).then((results) => {
      task.onSuccess(results);
    }).catch((error) => {
      logger.error(error.message, task.onError);
    });
  }

  /**
  * @function hamsterWheel - Runs or queues function using threads
  * @param {object} array - Provided library functionality options for this task
  * @param {object} task - Provided library functionality options for this task
  * @param {boolean} persistence - Whether persistence mode is enabled or not
  * @param {function} wheel - Results from select hamster wheel
  * @param {function} resolve - onSuccess method
  * @param {function} reject - onError method
  */
  hamsterWheel(thread, task, resolve, reject) {
    let index = task.indexes[thread];
    if(this.maxThreads === pool.running.length) {
      return this.addWorkToPending(index, resolve, reject);
    }
    let hamster = pool.fetchHamster(pool.running.length, habitat);
    task.run(hamster, index, resolve, reject);
  }

}


//Expose library class
let hamsters = new hamstersjs();