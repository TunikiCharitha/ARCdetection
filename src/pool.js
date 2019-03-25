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

import hamstersData from './data';
import hamstersHabitat from './habitat';
import hamstersLogger from './logger';

export default class pool {
	
  /**
  * @constructor
  * @function constructor - Sets properties for this class
  */
  constructor() {
    this.threads = [];
    this.fetchHamster = this.getThread;
    this.spawnHamsters = this.createThreads;
    this.spawnHamster = this.createThread;
  }

    /**
  * @function spawnHamsters - Spawns multiple new threads for execution
  * @param {function} wheel - Results from select hamster wheel
  * @param {number} maxThreds - Max number of threads for this client
  */
  createThreads(maxThreads) {
    for (maxThreads; maxThreads > 0; maxThreads--) {
      this.threads.push(createThread());
    }
  }

  /**
  * @function spawnHamster - Spawns a new thread for execution
  * @return {object} WebWorker - New WebWorker thread using selected scaffold
  */
  createThread() {
    let newWheel = this.selectHamsterWheel();
    if (hamstersHabitat.webWorker) {
      return new hamstersHabitat.SharedWorker(newWheel, 'SharedHamsterWheel');
    }
    return new hamstersHabitat.Worker(newWheel);
  }

  /**
  * @function grabHamster - Keeps track of threads running, scoped globally and to task
  * @param {number} threadId - Id of thread
  * @param {boolean} persistence - Whether persistence mode is enabled or not
  * @param {function} wheel - Results from select hamster wheel
  */
  getThread(threadId, habitat) {
    if(habitat.persistence) {
      return this.threads[threadId];
    }
    return this.spawnHamster();
  }

  /**
  * @function scheduleTask - Determines which scaffold to use for proper execution for various environments
  */
  selectHamsterWheel() {
    if(habitat.reactNative) {
      return './scaffold/reactNative.js';
    }
    if(habitat.webWorker) {
      return './scaffold/sharedWorker.js';
    }
    return './scaffold/regular.js';
  }

  /**
  * @function returnOutputAndRemoveTask - gathers thread outputs into final result
  * @param {object} task - Provided library functionality options for this task
  * @param {function} resolve - onSuccess method
  */
  returnOutputAndRemoveTask(task, resolve) {
    let output = data.getOutput(task);
    if (task.sort) {
      output = data.sortOutput(output, task.sort);
    }
    task.completedAt = Date.now();
    let returnData = data.generateReturnObject(task, output);
    this.tasks[task.id] = null; //Clean up our task, not needed any longer
    resolve(returnData);
  }


  /**
  * @function processThreadOutput - Handles output data from thread
  * @param {object} task - Provided library functionality options for this task
  * @param {number} threadId - Internal use id for this thread
  * @param {worker} hamster - Thread to train
  * @param {function} resolve - onSuccess method
  */
  processThreadOutput(task, threadId, results, resolve) {
    data.mergeOutputData(task, threadId, results); //Merge results into data array as the thread returns, merge immediately don't wait
    if (task.workers.length === 0 && task.count === task.threads) { 
      this.returnOutputAndRemoveTask(task, resolve);
    }
  }

}
