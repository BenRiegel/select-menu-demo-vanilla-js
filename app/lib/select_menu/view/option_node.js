// module: option_node.js
// author: Ben Riegel
// overview: declares and exports a function that creates a new OptionNode
// object. The function creates and configures an instance of the Node class.
// It then creats a new variable attribute object, which represents a dom class
// names selected. It specifies how the value of that variable attribute is
// calculated. The function also registers a listener with the global store
// that instructors it to update the selected class variable when the global
// state updates.


//----- imports ----------------------------------------------------------------

import Node from '../utils/node.js';
import './stylesheets/option.css';


//----- export code block ------------------------------------------------------

export default function OptionNode( {key, value, label}, globalStore){

  //creates new node object and sets various attributes
  let optionNode = new Node('div');
  optionNode.addClass('select-option');
  optionNode.setDataProp('key', key);
  optionNode.setDataProp('value', value);
  optionNode.setInnerHtml(label);

  //defines new variable attribute of type class
  //the value calculator specifies that the class name 'selected' is applied
  //when the options's key is equal to the selected option key. It is null
  //otherwise, which means that the class name is removed
  let selectedClassAttr = optionNode.createNewVarAttr({
    type: 'class',
    valueCalculator: function(){
      const optionKey = optionNode.getDataProp('key');
      const isSelected = (optionKey === globalStore.selectedOptionKey);
      return isSelected ? 'selected' : null;
    }
  });


  //function that updates the selectedClass
  function selectedClassUpdate(){
    return optionNode.updateVarAttr(selectedClassAttr);
  }

  //registers the listener when the option is added to the dom
  optionNode.onMount = function(){
    globalStore.registerUpdateListener({
      type: 'option.selectedClassAttr',
      callback: selectedClassUpdate,
    });
  }

  //removes the listener when the option is removed from the dom
  optionNode.onUnmount = function(){
    globalStore.removeUpdateListener({
      type: 'option.selectedClassAttr',
      callback: selectedClassUpdate,
    });
  }

  return optionNode;
}
