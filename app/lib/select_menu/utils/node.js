// module: node.js
// author: Ben Riegel
// overview: declarees and exports the Node class. The constructor creates a
// dom node of a specied class. The class also includes various methods for
// performing operations on the dom node. It also creates a method for creating
// and updating a variable attribute, which is an object representing an
// attribute on the dom node. If the value changes, then the dom is updated in
// specific ways. The class also contains a method for rendering all the
// attributes for the dom node.


//----- export code block ------------------------------------------------------

export default class Node{

  //----- private code block -----

  #node;
  #varAttributes;
  #children;

  //higher-order function that does something that is animated. It takes
  //a function as a parameter, which triggers the animation. First, callback
  //called which notifies that an animation is starting. It then returns a
  //promise representing the completion of the animation. Inside the promise,
  //a handler created and added as an animationend listener. The animation
  //function is executed. When an animationend event fires, the handler unbinds
  // itself from the dom node, a callback is called which notifies than an
  //animation is ending. Then the promise is resolved.
  async #animate(animateFunction){
    await this.onAnimationStart();
    return new Promise( resolve => {
      let handler = async () => {
        this.#node.removeEventListener('animationend', handler);
        await this.onAnimationEnd();
        resolve();
      };
      this.#node.addEventListener('animationend', handler);
      animateFunction();
    });
  }

  //----- public api -----

  constructor(type){
    this.#node = document.createElement(type);
    this.#varAttributes = [];
    this.#children = [];
  }

  //functions for manipulating the dom node
  get node(){
    return this.#node;
  }

  addClass(className){
    this.#node.classList.add(className);
  }

  setDataProp(prop, value){
    this.#node.dataset[prop] = value;
  }

  getDataProp(prop){
    return this.#node.dataset[prop];
  }

  setInnerHtml(innerHtml){
    this.#node.innerHTML = innerHtml;
  }

  //function creates a new variable attribute. The function takes an object
  //that includes a valueCalculator function, which specifies the value
  //of that attribute is calculated. For each type of attribute, a doOnChange
  //function is created, which specifies how changes in the attribute value
  //are represented in the dom.
  createNewVarAttr(props){
    let newVarAttr = {
      value: undefined,
      valueCalculator: props.valueCalculator,
      isAnimatingCalculator: props.isAnimatingCalculator
    };
    switch (props.type){
      //if there's a change in this attribute value, then the current child nodes
      //are remove and new ones added
      case 'children':
        newVarAttr.doOnChange = (newChildren, oldChildren) => {
          if (oldChildren){
            //removes child node from the dom and calls the onUnmount
            oldChildren.forEach( child => {
              this.#node.removeChild(child.#node);
              child.onUnmount();
            });
          }
          newChildren.forEach( child => {
            //adds child node to the dom and calls the mount method
            this.#node.appendChild(child.#node);
            child.onMount();
          });
          this.#children = newChildren;
        };
        break;
      case 'data':
        //if there's a change in this attribute value, then the data property
        //is updated with the new value, if there is an animation, then it waits
        //for the animation to complete
        newVarAttr.doOnChange = (newValue, oldValue, isAnimating) => {
          if (isAnimating){
            return this.#animate( () => {
              this.setDataProp(props.name, newValue);
            });
          } else {
            this.setDataProp(props.name, newValue);
          }
        };
        break;
      case 'class':
        //if there's a change in this attribute value, then the class name is
        //added or removed from the node's classList
        newVarAttr.doOnChange = (newValue, oldValue) => {
          if (newValue === null){
            this.#node.classList.remove(oldValue);
          } else {
            this.#node.classList.add(newValue);
          }
        };
        break;
      case 'mouseUp':
        //if there's a change in this attribute value, then mouseUp handler
        //is added or removed
        newVarAttr.doOnChange = (newValue, oldValue) => {
          if (typeof oldValue === 'function'){
            this.#node.removeEventListener('mouseup', oldValue);
          }
          if (typeof newValue === 'function'){
            this.#node.addEventListener('mouseup', newValue);
          }
        };
        break;
    }
    this.#varAttributes.push(newVarAttr);
    return newVarAttr;
  }

  //function that updates a specified variable attribute. The valueCalculator
  //method of the variable attribute is called and returns a new value for that
  //attribute. If the value has changed, then it calls the isAnimatingCalculator
  //method, if present. This determines whether the update will involve an
  //animation or not. Finally, the doOnChange method is called, which updates
  //the dom and waits for an animation to complete, if applicable
  updateVarAttr(varAttribute){
    const newValue = varAttribute.valueCalculator();
    const oldValue = varAttribute.value;
    if (newValue !== oldValue){
      varAttribute.value = newValue;
      let isAnimating = false;
      if (varAttribute.isAnimatingCalculator){
        isAnimating = varAttribute.isAnimatingCalculator();
      }
      return varAttribute.doOnChange(newValue, oldValue, isAnimating);
    }
  }

  render(){
    //updates each variable attribute
    this.#varAttributes.forEach( varAttr => this.updateVarAttr(varAttr) );
    //renders each child
    this.#children.forEach( child => child.render() );
  }

}
