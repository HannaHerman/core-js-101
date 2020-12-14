/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function get() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const protoObj = Object.create(proto);
  const jsonObj = JSON.parse(json);
  return Object.assign(protoObj, jsonObj);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class SelectorCreater {
  constructor() {
    this.selectors = {
      element: '',
      id: '',
      class: '',
      attr: '',
      pseudoClass: '',
      pseudoElement: '',
      combination: '',
    };
    this.errors = {
      duplicate: 'Element, id and pseudo-element should not occur more then one time inside the selector',
      wrongOrder: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
    };
  }

  element(value) {
    if (this.selectors.element.length) {
      throw new Error(this.errors.duplicate);
    }
    if (this.checkOrder('element')) {
      throw new Error(this.errors.wrongOrder);
    }
    this.selectors.element += value;
    return this;
  }

  id(value) {
    if (this.selectors.id.length) {
      throw new Error(this.errors.duplicate);
    }
    if (this.checkOrder('id')) {
      throw new Error(this.errors.wrongOrder);
    }
    this.selectors.id += `#${value}`;
    return this;
  }

  class(value) {
    if (this.checkOrder('class')) {
      throw new Error(this.errors.wrongOrder);
    }
    this.selectors.class += `.${value}`;
    return this;
  }

  attr(value) {
    if (this.checkOrder('attr')) {
      throw new Error(this.errors.wrongOrder);
    }
    this.selectors.attr += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (this.checkOrder('pseudoClass')) {
      throw new Error(this.errors.wrongOrder);
    }
    this.selectors.pseudoClass += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.selectors.pseudoElement.length) {
      throw new Error(this.errors.duplicate);
    }
    if (this.checkOrder('pseudoElement')) {
      throw new Error(this.errors.wrongOrder);
    }
    this.selectors.pseudoElement += `::${value}`;
    return this;
  }

  checkOrder(selector) {
    const keys = Object.keys(this.selectors);
    const selectorIndex = keys.indexOf(selector);
    let output = keys.reduce((acc, val) => {
      if (this.selectors[val] !== '') {
        return acc + val;
      }
      return acc;
    }, '');
    output = output.split(' ');
    const validElements = output
      .filter((elem) => elem.length > 0 && keys.indexOf(elem) > selectorIndex).length;
    return validElements !== 0;
  }

  stringify() {
    return Object.keys(this.selectors).reduce((acc, val) => acc + this.selectors[val], '');
  }
}
const cssSelectorBuilder = {
  element(value) {
    return new SelectorCreater().element(value);
  },
  id(value) {
    return new SelectorCreater().id(value);
  },
  class(value) {
    return new SelectorCreater().class(value);
  },
  attr(value) {
    return new SelectorCreater().attr(value);
  },
  pseudoClass(value) {
    return new SelectorCreater().pseudoClass(value);
  },
  pseudoElement(value) {
    return new SelectorCreater().pseudoElement(value);
  },
  combine(selector1, combinator, selector2) {
    this.result = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  },
  stringify() {
    return this.result;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
