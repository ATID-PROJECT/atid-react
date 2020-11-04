import {
  assign
} from 'min-dash';
import uuid from "uuid";
import inherits from 'inherits';

import BpmnElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
import {
  DEFAULT_LABEL_SIZE
} from 'bpmn-js/lib/util/LabelUtil';


/**
 * A custom factory that knows how to create BPMN _and_ custom elements.
 */
export default function CustomElementFactory(bpmnFactory, moddle) {
  BpmnElementFactory.call(this, bpmnFactory, moddle);
  this._uid = 12;
  var self = this;

  /**
   * Create a diagram-js element with the given type (any of shape, connection, label).
   *
   * @param  {String} elementType
   * @param  {Object} attrs
   *
   * @return {djs.model.Base}
   */


  this.create = function(elementType, attrs) {

    var type = attrs.type;

    if(attrs.businessObject){
      
        attrs.id = attrs.businessObject.id;
        var current_id = parseInt( attrs.id.split("_")[1]);
        if(current_id >= this._uid)
          this._uid = current_id+1;
          
          attrs.businessObject.get = (attributeToGet) => {
            return attrs.businessObject[attributeToGet]
        }
        
        attrs.businessObject.set = (key, value) => {
            attrs.businessObject[key] = value
        }

      

      if(type==="custom:atividadeComposta")
      {
        attrs.uuid = attrs.businessObject.uuid;
      }
    }

    if (!attrs.uuid && type==="custom:atividadeComposta") {
      attrs.uuid = uuid.v4();
    }

    if (!attrs.id) {
        attrs.id = type + '_' + (this._uid++);
    }
    if (elementType === 'label') {
      return self.baseCreate(elementType, assign({ type: 'label' }, DEFAULT_LABEL_SIZE, attrs));
    }

    // add type to businessObject if custom
    if (/^custom:/.test(type)) {
      if (!attrs.businessObject) {
        attrs.businessObject = {
          type: type
        };

        attrs.businessObject.get = (attributeToGet) => {
          return attrs.businessObject[attributeToGet]
      }
      
      attrs.businessObject.set = (key, value) => {
          attrs.businessObject[key] = value
      }
      

        if (attrs.id) {
          assign(attrs.businessObject, {
            id: attrs.id
          });
        }
      }

      // add width and height if shape
      if (!/:connection$/.test(type)) {
        assign(attrs, self._getCustomElementSize(type));
      }

      if (!('$instanceOf' in attrs.businessObject)) {
        // ensure we can use ModelUtil#is for type checks
        Object.defineProperty(attrs.businessObject, '$instanceOf', {
          value: function(type) {
            return this.type === type;
          }
        });
      }

      return self.baseCreate(elementType, attrs);
    }

    return self.createBpmnElement(elementType, attrs);
  };
}

inherits(CustomElementFactory, BpmnElementFactory);

CustomElementFactory.$inject = [
  'bpmnFactory',
  'moddle'
];


/**
 * Returns the default size of custom shapes.
 *
 * The following example shows an interface on how
 * to setup the custom shapes's dimensions.
 *
 * @example
 *
 * var shapes = {
 *   triangle: { width: 40, height: 40 },
 *   rectangle: { width: 100, height: 20 }
 * };
 *
 * return shapes[type];
 *
 *
 * @param {String} type
 *
 * @return {Dimensions} a {width, height} object representing the size of the element
 */
CustomElementFactory.prototype._getCustomElementSize = function(type) {
  var shapes = {
    __default: { width: 100, height: 80 },
    'custom:evento': { width: 40, height: 40 },
    'custom:start': { width: 40, height: 40, },
    'custom:end': { width: 40, height: 40 },
    'custom:atividadeBasica': { width: 40, height: 40 },
    'custom:atividadeComposta': { width: 40, height: 40 },
    'custom:transicao': { width: 40, height: 60 },
    'custom:repositorio': { width: 40, height: 40 }
  };

  return shapes[type] || shapes.__default;
};