// module: view.js
// author: Ben Riegel
// overview: this module initializes a new select menu and adds it's node
// to the dom. It then retrieves the nodes for the output and the radio
// buttons. It then exports an object that represents the app's view. This
// object contains references to the select menu, dom elements, and a function
// that logs a new message to the output.


//----- imports ----------------------------------------------------------------

import SelectMenu from '../lib/select_menu/select_menu.js';


//----- module code block ------------------------------------------------------

//schema for the select menu
const initGlobalStateValue = {
  options: [ {key:'0', value:'option1', label:'Option 1'},
             {key:'1', value:'option2', label:'Option 2'},
             {key:'2', value:'option3', label:'Option 3'},
             {key:'3', value:'option4', label:'Option 4'},
             {key:'4', value:'option5', label:'Option 5'},
             {key:'5', value:'option6', label:'Option 6'},
           ],
  selectedOptionIndex: 0,
  openState:'closed',
}

//creates new select menu component and adds it's root node to the dom
let selectMenu = new SelectMenu(initGlobalStateValue);
let selectMenuParent = document.getElementById('select-option-section');
selectMenuParent.appendChild(selectMenu.rootNode);

//gets dom elements
let outputNode = document.querySelector('.output');
let isEnabledRadios = document.forms['controls'].elements['is-enabled'];
let isAnimatingRadios = document.forms['animations'].elements['is-animating'];


//----- export code block ------------------------------------------------------

//view object
export default {
  selectMenu,
  isEnabledRadios:[...isEnabledRadios],
  isAnimatingRadios:[...isAnimatingRadios],
  //function that takes a new message and adds it to the dom
  log: function(message){
    let node = document.createElement('div');
    node.innerHTML = message;
    outputNode.appendChild(node);
    outputNode.scrollTop = outputNode.scrollHeight;
  },
};
