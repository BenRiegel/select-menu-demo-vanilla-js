// module: global_store.js
// author: Ben Riegel
// overview: declares and exports the GlobalStore class. The constructor takes
// an object which initializes the global state object. A clickAction method is
// specified. If an option is clicked, this method is called and updates the
// state in the specified way.


//----- imports ----------------------------------------------------------------

import Store from '../utils/store.js';


//----- export code block ------------------------------------------------------

export default class GlobalStore extends Store{

  //----- private code block -----

  #getNextOpenState(){
    return (this.openState === 'open') ? 'closed' : 'open';
  }

  //----- public api -----

  //the global store contains a state variable with four properties:
  //1) the schema for the child options (options); 2) the value of the
  //currently selected option, 3) the key of the currently selected option,
  //and 4) the current openState
  constructor( {options, selectedOptionIndex, openState} ){
    super({
      options,
      selectedOptionValue: options[selectedOptionIndex].value,
      selectedOptionKey: options[selectedOptionIndex].key,
      openState,
    });
  }

  //this function updates the state with the value and key of the option
  //that was clicked. The openState property is then toggled
  clickAction( {optionValue, optionKey} ){
    return this.setState('clickAction', {
      selectedOptionValue: optionValue,
      selectedOptionKey: optionKey,
      openState: this.#getNextOpenState(),
    });
  }

}
