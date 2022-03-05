// module: controller.js
// author: Ben Riegel
// overview: declares and exports a function that initiates the app. It sets
// event listeners for the select menu. When these events occur, then messages
// are logged on the screen. It then adds listeners for the radio buttons.
// When the buttons are toggled, then the selectMenu's controls / animations
// are enabled / disabled.


//----- imports ----------------------------------------------------------------

import view from '../view/view.js';


//----- export code block ------------------------------------------------------

export default function initApp(){

  //logs messages when select menu events occur
  view.selectMenu.setEventListener('animationStart', function(){
    view.log('Animation starting . . .');
  });

  view.selectMenu.setEventListener('animationEnd', function(){
    view.log('Animation ended');
  });

  view.selectMenu.setEventListener('newSelectedValue', function(newValue){
    view.log('New selected value - ' + newValue);
  });

  //enables / disables select menu's controls / animations when the radio
  //buttons are toggled
  for (let radio of view.isEnabledRadios){
    radio.addEventListener('click', function(){
      const controlsEnabled = (radio.value === 'Enabled');
      if (controlsEnabled){
        view.selectMenu.enableControls();
      } else {
        view.selectMenu.disableControls();
      }
    });
  }

  for (let radio of view.isAnimatingRadios){
    radio.addEventListener('click', function(){
      const animationsEnabled = (radio.value === 'Enabled');
      if (animationsEnabled){
        view.selectMenu.enableAnimations();
      } else {
        view.selectMenu.disableAnimations();
      }
    });
  }

}
