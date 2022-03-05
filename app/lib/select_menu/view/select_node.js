// module: select_node.js
// author: Ben Riegel
// overview: declares and exports a function that creates a new SelectNode
// object. The function creates and configures an instance of the Node class.
// It then registers callbacks for when an animation starts and stops. It then
// creates four new variable attributes and registers listeners with the
// global store and view store. The variable attributes are updated with the
// state objects within the stores are changed.


//----- imports ----------------------------------------------------------------

import Node from '../utils/node.js';
import OptionNode from './option_node.js';
import './stylesheets/select.css';


//----- export code block ------------------------------------------------------

export default function SelectNode(globalStore, viewStore){

  //creates and configures new node object
  let selectNode = new Node('div');
  selectNode.addClass('select')

  //defines callbacks for animation start and end events; these notify
  //the view store that an animation has started and stopped
  selectNode.onAnimationStart = function(){
    return viewStore.animationStartAction();
  };
  selectNode.onAnimationEnd = function(){
    return viewStore.animationEndAction();
  };

  //defines new variable attribute of type class
  //the value calculator specifies that an animation is in progress,
  //then the node is assigned a class 'animating'; the class is removed if
  //not animating
  let animatingClassAttr = selectNode.createNewVarAttr({
    type: 'class',
    valueCalculator: function(){
      if (viewStore.animationInProgress){
        return 'animating';
      } else {
        return null;
      }
    }
  });

  //defines new variable attribute of type class
  //the value calculator specifies that when the openState property of the
  //global store's state is updated, then new value is assigned to a dataset
  //property
  let openStateDataAttr = selectNode.createNewVarAttr({
    type: 'data',
    name: 'state',
    valueCalculator: function(){
      return globalStore.openState;
    },
    isAnimatingCalculator: function(){
      return viewStore.animationsEnabled;
    },
  });

  //defines new variable attribute of type class
  //the value calculator specifies that when the children property of the
  //global store's state is updated, then an array of new option nodes is
  //assigned to the node's children
  let childrenAttr = selectNode.createNewVarAttr({
    type: 'children',
    valueCalculator: function(){
      return globalStore.options.map( optionSchema => {
        return new OptionNode(optionSchema, globalStore);
      });
    }
  });

  //defines new variable attribute of type class
  //the value calculator specifies that when the controls are enabled and
  //an animation is not in progress, then a click (mouseUp) listener is
  //added to the dom. It is remove otherwise.
  let mouseUpListenerAttr = selectNode.createNewVarAttr({
    type:'mouseUp',
    valueCalculator: function(){
      if (viewStore.controlsEnabled && !viewStore.animationInProgress){
        return function mouseUpHandler(evt){
          const clickedOption = evt.target;
          const optionKey = clickedOption.dataset.key;
          const optionValue = clickedOption.dataset.value;
          globalStore.clickAction( {optionKey, optionValue} );
        }
      } else {
        return null;
      }
    }
  });

  //registers listeners for the global store and view store and checks to see
  //if the variable attributes need to be updated

  globalStore.registerUpdateListener({
    type: 'select.openStateDataAttr',
    callback: function(){
      return selectNode.updateVarAttr(openStateDataAttr);
    }
  });

  viewStore.registerUpdateListener({
    type: 'select.animatingClassAttr',
    callback: function(){
      return selectNode.updateVarAttr(animatingClassAttr);
    }
  });

  viewStore.registerUpdateListener({
    type: 'select.mouseUp',
    callback: function(){
      return selectNode.updateVarAttr(mouseUpListenerAttr);
    }
  });

  return selectNode;

}
