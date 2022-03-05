// module: view_store.js
// author: Ben Riegel
// overview: declares and exports the ViewStore class. The constructor
// initializes the state variable with three properties. Action methods are
// created which update the state in specific ways based on the type of action.


//----- imports ----------------------------------------------------------------

import Store from '../utils/store.js';


//----- export code block ------------------------------------------------------

export default class ViewStore extends Store{

  //the view stores contains a state variable with three properties: 1) a
  //property that specifies whether the click controls have been enabled or
  //disabled by the user, 2) a property that specifies whether animations
  //have been enabled or disabled by the user, and 3) a property that specifies
  //whether an animation is currently in progress.
  constructor(){
    super({
      controlsEnabled: true,
      animationsEnabled: true,
      animationInProgress: false,
    });
  }

  //various actions that update the state object
  animationStartAction(){
    return this.setState('animationStartAction', {animationInProgress:true} );
  }

  animationEndAction(){
    return this.setState('animationEndAction', {animationInProgress:false} );
  }

  enableControlsAction(){
    return this.setState('enableControlsAction', {controlsEnabled:true} );
  }

  disableControlsAction(){
    return this.setState('disableControlsAction', {controlsEnabled:false} );
  }

  enableAnimationsAction(){
    return this.setState('enableAnimationsAction', {animationsEnabled:true} );
  }

  disableAnimationsAction(){
    return this.setState('disableAnimationsAction', {animationsEnabled:false} );
  }

}
