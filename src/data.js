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

import hamstersHabitat from './habitat';
import hamstersLogger from './logger';

export default class data {

  /**
  * @constructor
  * @function constructor - Sets properties for this class
  */
  constructor() {
    this.randomArray = this.randomArray;
    this.generateIndexes = this.determineSubArrayIndexes;
    this.createBlob = this.createDataBlob;
    this.generateWorkerBlob = this.generateWorkerBlob;
    this.processDataType = this.processDataType;
    this.sortOutput = this.sortArray;
    this.getOutput = this.prepareOutput;
  }

  /**
  * @function generateWorkerBlob - Creates blob uri for flexible scaffold loading
  * @param {function} workerLogic - Scaffold to use within worker thread
  */
  generateWorkerBlob(workerLogic) {
    let hamsterBlob = this.createDataBlob('(' + String(workerLogic) + ')();');
    let dataBlobURL = URL.createObjectURL(hamsterBlob);
    return dataBlobURL;
  }

  /**
  * @function mergeOutputData - Merges output data into data array, using indexes
  * @param {object} task - Provided library functionality options for this task
  * @param {number} threadId - Internal use id for this thread
  * @param {object} results - Message object containing results from thread
  */
  mergeOutputData(task, threadId, results) {
    var data = hamstersHabitat.reactNative ? JSON.parse(results.data) : results.data;
    var arrayIndex = task.indexes[threadId].start; //Starting value index for subarray to merge
    for (var i = 0; i < data.length; i++) {
      task.params.array[arrayIndex] = data[i];
      arrayIndex++;
    }
  }

  /**
  * @function processDataType - Converts buffer into new typed array
  * @param {string} dataType - Typed array type for this task
  * @param {object} buffer - Buffer to convert
  */
  processDataType(dataType, buffer, transferrable) {
    if(transferrable) {
      return this.typedArrayFromBuffer(dataType, buffer);
    }
    return buffer;
  }

  /**
  * @function prepareOutput - Prepares final task output
  * @param {task} buffer - Task to prepare output for
  */
  prepareOutput(task) {
    return task.params.array;
  }


  /**
  * @function generateReturnObject - Creates output result object including useful runtime info
  * @param {task} buffer - Task to prepare output for
  * @param {task} buffer - Final task output data
  */
  generateReturnObject(task, output) {
    return {
      threads: task.threads,
      dataType: task.dataType,
      memoize: task.memoize,
      indexes: task.indexes,
      aggregate: task.aggregate,
      createdAt: task.createdAt,
      completedAt: task.completedAt,
      queuedAt: task.queuedAt,
      results: output
    };
  }
  /**
  * @function sortArray - Sorts array by defined order
  * @param {object} arr - Array to sort
  * @param {string} order - Defined sort order
  */
  sortArray(arr, order) {
    switch(order) {
      case 'desc':
      case 'asc':
        return Array.prototype.sort.call(arr, function(a, b) {
          return (order === 'asc' ? (a - b) : (b - a)); 
        });
      case 'ascAlpha':
        return arr.sort();
      case 'descAlpha':
        return arr.reverse();
      default:
        return arr;
    }
  }

  /**
  * @function typedArrayFromBuffer - Converts buffer into new typed array
  * @param {string} dataType - Typed array type for this task
  * @param {object} buffer - Buffer to convert
  */
  typedArrayFromBuffer(dataType, buffer) {
    const types = {
      'uint32': Uint32Array,
      'uint16': Uint16Array,
      'uint8': Uint8Array,
      'uint8clamped': Uint8ClampedArray,
      'int32': Int32Array,
      'int16': Int16Array,
      'int8': Int8Array,
      'float32': Float32Array,
      'float64': Float64Array
    };
    if(!types[dataType]) {
      return dataType;
    }
    return new types[dataType](buffer);
  }


  /**
  * @function createDataBlob - Attempts to locate data blob builder, vender prefixes galore
  */
  locateBlobBuilder() {
    if(typeof BlobBuilder !== 'undefined') {
      return BlobBuilder;
    }
    if(typeof WebKitBlobBuilder !== 'undefined') {
      return WebKitBlobBuilder;
    }
    if(typeof MozBlobBuilder !== 'undefined') {
      return MozBlobBuilder;
    }
    if(typeof MSBlobBuilder !== 'undefined') {
      return MSBlobBuilder;
    }
    return hamstersLogger.error('Environment does not support data blobs!');
  }

  /**
  * @function createDataBlob - Creates new data blob from textContent
  * @param {string} textContent - Provided text content for blob
  */
  createDataBlob(textContent) {
    if(typeof Blob === 'undefined') {
      let BlobMaker = this.locateBlobBuilder();
      let blob = new BlobMaker();
      blob.append([textContent], {
        type: 'application/javascript'
      });
      return blob.getBlob();
    }
    return new Blob([textContent], {
      type: 'application/javascript'
    });
  }

  /**
  * @function randomArray - Creates new random array
  * @param {number} count - Number of random elements in array
  * @param {function} onSuccess - onSuccess callback
  */
  randomArray(count, onSuccess) {
    var randomArray = [];
    while(count > 0) {
      randomArray.push(Math.round(Math.random() * (100 - 1) + 1));
      count -= 1;
    }
    onSuccess(randomArray);
  }

  /**
  * @function determineSubArrayIndexes - Creates object containing starting and end value indexs for subarrays
  * @param {array} array - Array to use
  * @param {number} n - Number of subarrays to create indexes for
  */
  determineSubArrayIndexes(array, n) {
    let i = 0;
    let size = Math.ceil(array.length/n);
    let indexes = [];
    while(i < array.length) {
      indexes.push({start: i, end: (i += size)});
    }
    return indexes;
  }

  /**
  * @function getSubArrayUsingIndex - Fetches subarray from array using pre-determined start and end index
  * @param {array} array - Array to split
  * @param {index} object - Object containing index of start and end values for subarray
  */
  getSubArrayUsingIndex(array, index) {
    if(array.slice) {
      return array.slice(index['start'], index['end']);
    }
    return array.subarray(index['start'], index['end']);
  }
}
