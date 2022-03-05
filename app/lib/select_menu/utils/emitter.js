// module: emitter.js
// author: Ben Riegel
// overview: declares and exports the Emitter class. The constructor takes an
// option eventNames variable which specifies which event names can be listened
// for and broadcasted. The class also contains methods for setting event
// listeners and broadcasting events


//----- export code block ------------------------------------------------------

export default class Emitter{

  //----- private code block -----

  #eventNames;
  #listeners;

  //----- public api -----

  //eventNames is an option list of available events
  constructor(eventNames){
    this.#eventNames = eventNames;
    this.#listeners = {};
  }

  //method for registered an event listener. If a list of event names has
  //been specified, the function checks whether the current event is in the
  //list and throws an error if it isn't. This helps to catch bugs due to
  //accidentally misspelled eventNames
  setEventListener(eventName, callback){
    if (this.#eventNames && !this.#eventNames.includes(eventName)){
      throw new Error('Event name is invalid: ' + eventName);
    } else {
      this.#listeners[eventName] = callback;
    }
  }

  //notifies the listener for a specified event. If a list of event names has
  //been specified, the function checks whether the current event is in the
  //list and throws an error if it isn't.
  broadcast(eventName, ...args){
    if (this.#eventNames && !this.#eventNames.includes(eventName)){
      throw new Error('Event name is invalid: ' + eventName);
    } else {
      const listener = this.#listeners[eventName];
      if (listener){
        return listener(...args);
      }
    }
  }

}
