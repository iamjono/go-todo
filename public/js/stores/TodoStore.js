/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _todos = {};

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create(text) {
	obj = {};
	obj.Item = text;
	$.ajax({
	      url: 'http://localhost:3000/api/new',
	      dataType: 'json',
	      method: 'put',
	      async: false,
	      data: obj,
	      success: function(data) {
	    	  return  
	      },
	      error: function(xhr, status, err) {
	    	  console.error('/api/new', status, err.toString());
	      }
	  });
	return
}

/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
	obj = {};
	obj.ID = id;
	obj.Item = updates['text'];
	if(typeof updates['complete'] === 'boolean') {
		obj.Item = updates['complete'];
	}
	$.ajax({
	      url: 'http://localhost:3000/api/update',
	      dataType: 'json',
	      method: 'post',
	      async: false,
	      data: obj,
	      success: function(data) {
	    	  return  
	      },
	      error: function(xhr, status, err) {
	    	  console.error('/api/update', status, err.toString());
	      }
	  });
	return
//  _todos[id] = assign({}, _todos[id], updates);
}
function status(id, updates) {
	obj = {};
	obj.ID = id;
	obj.Complete = updates['complete'];
	$.ajax({
	      url: 'http://localhost:3000/api/status',
	      dataType: 'json',
	      method: 'post',
	      async: false,
	      data: obj,
	      success: function(data) {
	    	  return  
	      },
	      error: function(xhr, status, err) {
	    	  console.error('/api/status', status, err.toString());
	      }
	  });
	return
//  _todos[id] = assign({}, _todos[id], updates);
}

/**
 * Update all of the TODO items with the same object.
 *     the data to be updated.  Used to mark all TODOs as completed.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.

 */
function updateAll(updates) {
  for (var id in _todos) {
    update(id, updates);
  }
}

/**
 * Delete a TODO item.
 * @param  {string} id
 */
function destroy(id) {
	$.ajax({
	      url: 'http://localhost:3000/api/delete/'+id,
	      dataType: 'json',
	      method: 'delete',
	      async: false,
	      success: function(data) {
	    	  return  
	      },
	      error: function(xhr, status, err) {
	    	  console.error('/api/delete', status, err.toString());
	      }
	  });
	return
}

/**
 * Delete all the completed TODO items.
 */
function destroyCompleted() {
  for (var id in _todos) {
    if (_todos[id].complete) {
      destroy(id);
    }
  }
}

var TodoStore = assign({}, EventEmitter.prototype, {
	apinode: 'http://localhost:3000/api/',
  /**
   * Tests whether all the remaining TODO items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function() {
    for (var id in _todos) {
      if (!_todos[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
	  var _todosc = new Array;
	  $.ajax({
	      url: this.apinode+'list',
	      dataType: 'json',
	      async: false,
	      success: function(data) {
	    	  for(var i=0; i < data.length; i++){
	    		  _todosc[_todosc.length] = {
	    				    id: data[i].ID,
	    				    complete: data[i].Complete,
	    				    text: data[i].Item
	    				  };
	    	  }
	    	  return _todosc;
	      },
	      error: function(xhr, status, err) {
	    	  console.error('/api/list', status, err.toString());
	      }
	    });
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case TodoConstants.TODO_CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text);
        TodoStore.emitChange();
      }
      break;

    case TodoConstants.TODO_TOGGLE_COMPLETE_ALL:
      if (TodoStore.areAllComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_UNDO_COMPLETE:
      status(action.id, {complete: false});
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_COMPLETE:
    	status(action.id, {complete: true});
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_UPDATE_TEXT:
      text = action.text.trim();
      if (text !== '') {
        update(action.id, {text: text});
        TodoStore.emitChange();
      }
      break;

    case TodoConstants.TODO_DESTROY:
      destroy(action.id);
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_DESTROY_COMPLETED:
      destroyCompleted();
      TodoStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = TodoStore;
