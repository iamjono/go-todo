/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var TodoActions = require('../actions/TodoActions');
var TodoItem = require('./TodoItem.react');
var TodoStore = require('../stores/TodoStore');

//TodoActions.refresh();

var MainSection = React.createClass({

  propTypes: {
//    allTodos: ReactPropTypes.array.isRequired,
    areAllComplete: ReactPropTypes.bool.isRequired
  },
  
  /**
   * @return {object}
   */
  render: function() {
//	  console.log('MainSection Render')
	  
	  var allTodos = new Array;
	  var todos = [];
	  $.ajax({
	      url: 'http://localhost:3000/api/list',
	      dataType: 'json',
	      async: false,
	      success: function(data) {
	    	  for(var i=0; i < data.length; i++){
	    		  allTodos[allTodos.length] = {
	    				    id: data[i].ID,
	    				    complete: data[i].Complete,
	    				    text: data[i].Item
	    				  };
	    	  }
	    	  for (var key=0; key < allTodos.length; key++) {
	    		  todos.push(<TodoItem key={allTodos[key].id} todo={allTodos[key]} />);
	    	  }
	    	    return (
	    	    	      <section id="main">
	    	    	        <ul id="todo-list">{todos}</ul>
	    	    	      </section>
	    	    	    );

	    	  
	      },
	      error: function(xhr, status, err) {
	    	  console.error(apinode+'list', status, err.toString());
	      }
	    });


    return (
      <section id="main">
        <ul id="todo-list">{todos}</ul>
      </section>
    );
  },

  /**
   * Event handler to mark all TODOs as complete
   */
  _onToggleCompleteAll: function() {
    TodoActions.toggleCompleteAll();
  }

});

module.exports = MainSection;
