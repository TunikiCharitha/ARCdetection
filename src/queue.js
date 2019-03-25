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

export default class queue {

	/**
	* @constructor
	*/
	constructor(interval) {
		this.tickInterval = interval || 4; //Default is 4ms (HTML5 spec minimum)
		this.tasks = [];
		this.running = [];
		this.pending = [];
		this.tick();
	}

	checkQueue() {
		if (this.pending.length !== 0 && pool.running !== maxThreads) { //If work is pending and we have an available thread, get it started
			this.processQueuedItem(this.pending.shift());
		}
	}


	/**
	* @function keepTrackOfThread - Keeps track of threads running, scoped globally and to task
	* @param {object} task - Provided library functionality options for this task
	* @param {number} id - Id of thread to track
	*/
	keepTrackOfThread(task, id) {
		task.workers.push(id); //Keep track of threads scoped to current task
		this.running.push(id); //Keep track of all currently running threads
	}

	/**
	* @function registerTask - Adds task to execution pool based on id
	* @param {number} id - Id of task to register
	*/
	registerTask(id) {
		this.tasks.push(id);
	}

	/**
	* @function grabHamster - Adds task to queue waiting for available thread
	* @param {object} array - Provided data to execute logic on
	* @param {object} task - Provided library functionality options for this task
	* @param {boolean} persistence - Whether persistence mode is enabled or not
	* @param {function} wheel - Results from select hamster wheel
	* @param {function} resolve - onSuccess method
	* @param {function} reject - onError method
	*/
	addToPending(array, task, persistence, wheel, resolve, reject) {
		task.queuedAt = Date.now(); //Add a timestamp for when this task was put into the pending queue, useful for performance profiling
		this.pending.push(arguments);
	}

	/**
	* @function grabHamster - Invokes processing of next item in queue
	* @param {object} taskItem - Work to be processed
	*/
	processQueuedItem(taskItem) {
  		return this.runTask(hamster, taskItem);
	}

	/**
	* @function tick - Loops every N milliseconds checking for pending items to complete
	*/
	tick() {
		setInterval(function() {
			this.checkQueue();
		}, this.tickInterval);
	}

}