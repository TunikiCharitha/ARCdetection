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

export default class task {

	/**
	* @constructor
	* @function task - Constructs a new task object from provided arguments
	* @param {object} params - Provided library execution options
	* @param {function} functionToRun - Function to execute
	* @return {object} new Hamsters.js task
	*/
	constructor(params, functionToRun, resolve, reject) {
		this.id = pool.tasks.length;
	    this.count = 0;
	    this.aggregate = (params.aggregate || false);
	    this.workers = [];
	    this.memoize = (params.memoize || false);
	    this.dataType = (params.dataType ? params.dataType.toLowerCase() : null);
	    this.params = params;
	    // Do not modify function if we're running on the main thread for legacy fallback
	    this.threads = (habitat.legacy ? 1 : (params.threads || 1));
	    this.hamstersJob = (habitat.legacy ? functionToRun : data.prepareJob(functionToRun));
	    // Determine sub array indexes, precalculate ahead of time so we can pull data only when executing on a thread 
	    this.indexes = this.createArrayIndexes();
	    this.onSuccess = resolve;
	    this.onError = reject;
	    this.createdAt = Date.now();
	    this.completedAt = null;
	    this.queuedAt = null;
	}

	createArrayIndexes() {
		//If we aren't dealing with an array we dont have any indexes to compute
		//Additionally if we are only dealing with 1 thread this is a waste of time
		if(typeof this.params.array !== 'undefined' && this.threads > 1) {
			return data.generateIndexes(this.params.array, this.threads);
		}
		return [];
	}

	/**
	* @function scheduleTask - Adds new task to the system for execution
	* @param {object} task - Provided library functionality options for this task
	* @param {boolean} persistence - Whether persistence mode is enabled or not
	* @param {function} wheel - Scaffold to execute login within
	* @param {number} maxThreads - Maximum number of threads for this client
	*/
	schedule() {
		return new Promise((resolve, reject) => {
		  let i = 0;
		  while (i < task.threads) {
		    this.hamsterWheel(i, this, resolve, reject);
		    i += 1;
		  }
		});
	}

	/**
	* @function hamsterWheel - Runs function using thread
	* @param {object} array - Provided data to execute logic on
	* @param {object} task - Provided library functionality options for this task
	* @param {boolean} persistence - Whether persistence mode is enabled or not
	* @param {function} wheel - Results from select hamster wheel
	* @param {function} resolve - onSuccess method
	* @param {function} reject - onError method
	*/
	run(hamster, index, resolve, reject) {
		let threadId = pool.running.length;
		let hamsterFood = data.prepareMeal(index, this);
		this.registerTask(this.id);
		this.keepTrackOfThread(this, threadId);
		if(habitat.legacy) {
			legacy.run(hamsterFood, resolve, reject);
		} else {
		  	pool.trainHamster(this.count, this, hamster, resolve, reject);
		  	data.feedHamster(hamster, hamsterFood, habitat);
		}
		this.count += 1; //Increment count, thread is running
	}

}