// module: select_menu.js
// author: Ben Riegel
// overview: contains a function which creates and returns a new SelectMenu
// object. Inside the function, one service (emitter), two state objects
// (globalStore and ViewStore), one view object, and a controller object are
// created. The select menu component is then intiallized.


//----- imports ----------------------------------------------------------------

import Emitter from './utils/emitter.js'
import GlobalStore from './model/global_store.js';
import ViewStore from './model/view_store.js';
import SelectNode from './view/select_node.js';
import Controller from './controller/controller.js';


//----- export code block ------------------------------------------------------

export default function SelectMenu(initGlobalStateValue){

  //----- private code block -----

  //names of events that can be pubically listened for
  const eventNames = ['newSelectedValue', 'animationStart', 'animationEnd'];

  //service that handles event listening and broadcasting
  let emitter = new Emitter(eventNames);

  //store that contains global state
  let globalStore = new GlobalStore(initGlobalStateValue);
  //store than contains state that pertains to view
  let viewStore = new ViewStore();

  //view object
  let view = new SelectNode(globalStore, viewStore);

  //controller object which handlers how service, view and stores interact
  let controller = new Controller(emitter, globalStore, viewStore, view);

  //intiializes the component
  controller.init();

  //----- public api -----

  //returns selectMenu object
  return {
    rootNode: view.node,
    setEventListener: function(eventName, callback){
      emitter.setEventListener(eventName, callback);
    },
    enableControls: function(){
      viewStore.enableControlsAction();
    },
    disableControls: function(){
      viewStore.disableControlsAction();
    },
    enableAnimations: function(){
      viewStore.enableAnimationsAction();
    },
    disableAnimations: function(){
      viewStore.disableAnimationsAction();
    },
  };

}
