// module: controller.js
// author: Ben Riegel
// overview: declares and exports a function that creates a new Controller
// object. Inside the function, listeners are registered for updates from
// the viewStore and the globalStote. When the state objects are updated
// in these stores, the callbacks are notified and notifications of events
// are broadcasted. For the globalStore, the notification order for
// clickActions are set.


//----- export code block ------------------------------------------------------

export default function Controller(emitter, globalStore, viewStore, view){

  //listener is registered for viewStore updates. If the animationInProgress
  //property has changed, then a message is broadcasted to any listers
  viewStore.registerUpdateListener({
    type: 'emitter.notify',
    callback: function( {animationInProgress} ){
      if (animationInProgress.hasChanged){
        if (animationInProgress.newValue === true){
          emitter.broadcast('animationStart');
        } else {
          emitter.broadcast('animationEnd');
        }
      }
    }
  });

  //listener is registered for globalStore updates. If the selectedOptionValue
  //property has changed, then a message is broadcasted to any listeners
  globalStore.registerUpdateListener({
    type: 'emitter.notify',
    callback: function( {selectedOptionValue} ){
      if (selectedOptionValue.hasChanged){
        emitter.broadcast('newSelectedValue', selectedOptionValue.newValue);
      }
    }
  });

  //sets the notification order for clickAction updates to the globalStore.
  //Listeners with the specified types are notified in the specified order
  //If the listener functions are asyncronous, the notification function
  //waits until the listener has finished. When a user clicks on an option,
  //the options are notified and the selected option is updated if necessary.
  //Then the select menu opens or closes, and then the emitter is notified
  //and emits a message saying that there is a new selected option if
  //necessary.
  globalStore.setNotificationOrder('clickAction', [
    'option.selectedClassAttr',
    'select.openStateDataAttr',
    'emitter.notify'
  ]);

  //----- public api -----

  return {

    //function that initializes the select menu component
    //animations are initially turned off, the view renders for the first time
    //and then anations are turned on again.
    async init(){
      viewStore.disableAnimationsAction();
      await view.render();
      viewStore.enableAnimationsAction();
    }
  }

}
