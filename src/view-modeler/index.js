import Modeler from 'bpmn-js/lib/Modeler';

import {
  assign,
  isArray
} from 'min-dash';

import inherits from 'inherits';

import CustomModule from './custom';


export default function ViewModeler(options,click) {
  Modeler.call(this, options);
  this._onClick = click;
  this._customElements = [];

  var eventBus = this.get('eventBus');

  var events = [
    //'element.click',
    'element.dblclick',
  ];

  events.forEach(function(event) {

    eventBus.on(event, function(e) {
      // e.element = the model element
      // e.gfx = the graphical element
    
        click(e);
      
    });
  });


}

inherits(ViewModeler, Modeler);

ViewModeler.prototype._modules = [].concat(
  ViewModeler.prototype._modules,
  [
    CustomModule
  ]
);

/**
 * Add a single custom element to the underlying diagram
 *
 * @param {Object} customElement
 */
ViewModeler.prototype._addCustomShape = function(customElement) {

  this._customElements.push(customElement);

  var canvas = this.get('canvas'),
      elementFactory = this.get('elementFactory');

  var customAttrs = assign({ businessObject: customElement }, customElement);

  var customShape = elementFactory.create('shape', customAttrs);

  customShape.businessObject.id = customShape.id;

  if(customShape.businessObject.type==="custom:atividadeComposta")
    customShape.businessObject.uuid = customShape.uuid;
    
  return canvas.addShape(customShape);

};

ViewModeler.prototype.clearAll = function() {
  this.get('canvas')._clear();
  this._customElements = [];

}

ViewModeler.prototype._addCustomConnection = function(customElement) {

  this._customElements.push(customElement);

  var canvas = this.get('canvas'),
      elementFactory = this.get('elementFactory'),
      elementRegistry = this.get('elementRegistry');

  var customAttrs = assign({ businessObject: customElement }, customElement);

  var connection = elementFactory.create('connection', assign(customAttrs, {
    source: elementRegistry.get(customElement.source),
    target: elementRegistry.get(customElement.target)
  }),
  elementRegistry.get(customElement.source).parent);

  return canvas.addConnection(connection);

};

/**
 * Add a number of custom elements and connections to the underlying diagram.
 *
 * @param {Array<Object>} customElements
 */


ViewModeler.prototype.addCustomElements = function(customElements) {

  if (!isArray(customElements)) {
    throw new Error('argument must be an array');
  }

  var shapes = [],
      connections = [];

  customElements.forEach(function(customElement) {
    if (isCustomConnection(customElement)) {
      connections.push(customElement);
    } else {
      shapes.push(customElement);
    }
  });

  // add shapes before connections so that connections
  // can already rely on the shapes being part of the diagram
  shapes.forEach(this._addCustomShape, this);

  connections.forEach(this._addCustomConnection, this);
};

/**
 * Get custom elements with their current status.
 *
 * @return {Array<Object>} custom elements on the diagram
 */
ViewModeler.prototype.getCustomElements = function() {
  return this._customElements;
};


function isCustomConnection(element) {
  return element.type === 'custom:connection';
}
