'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var symbols = require('@redux-saga/symbols');

var _statusToStringMap;

var RUNNING = 0;
var CANCELLED = 1;
var ABORTED = 2;
var DONE = 3;
var statusToStringMap = (_statusToStringMap = {}, _statusToStringMap[RUNNING] = 'Running', _statusToStringMap[CANCELLED] = 'Cancelled', _statusToStringMap[ABORTED] = 'Aborted', _statusToStringMap[DONE] = 'Done', _statusToStringMap);
var cloneableGenerator = function cloneableGenerator(generatorFunc) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var history = [];
    var gen = generatorFunc.apply(void 0, args);
    return {
      next: function next(arg) {
        history.push(arg);
        return gen.next(arg);
      },
      clone: function clone() {
        var clonedGen = cloneableGenerator(generatorFunc).apply(void 0, args);
        history.forEach(function (arg) {
          return clonedGen.next(arg);
        });
        return clonedGen;
      },
      return: function _return(value) {
        return gen.return(value);
      },
      throw: function _throw(exception) {
        return gen.throw(exception);
      }
    };
  };
};

var assertStatusRunning = function assertStatusRunning(status) {
  if (status !== RUNNING) {
    var str = statusToStringMap[status];
    throw new Error("The task is no longer Running, it is " + str + ". You can't change the status of a task once it is no longer running.");
  }
};

function createMockTask() {
  var _ref;

  var status = RUNNING;
  var taskResult;
  var taskError;
  return _ref = {}, _ref[symbols.TASK] = true, _ref.isRunning = function isRunning() {
    return status === RUNNING;
  }, _ref.isCancelled = function isCancelled() {
    return status === CANCELLED;
  }, _ref.isAborted = function isAborted() {
    return status === ABORTED;
  }, _ref.result = function result() {
    return taskResult;
  }, _ref.error = function error() {
    return taskError;
  }, _ref.cancel = function cancel() {
    assertStatusRunning(status);
    status = CANCELLED;
  }, _ref.joiners = [], _ref.setRunning = function setRunning() {
    // eslint-disable-next-line no-console
    console.warn('setRunning has been deprecated. It no longer has any effect when being called. ' + 'If you were calling setResult or setError followed by setRunning, those methods now change the ' + 'running status of the task. Simply remove the call to setRunning for the desired behavior.');
  }, _ref.setResult = function setResult(r) {
    assertStatusRunning(status);
    taskResult = r;
    status = DONE;
  }, _ref.setError = function setError(e) {
    assertStatusRunning(status);
    taskError = e;
    status = ABORTED;
  }, _ref;
}

exports.cloneableGenerator = cloneableGenerator;
exports.createMockTask = createMockTask;
