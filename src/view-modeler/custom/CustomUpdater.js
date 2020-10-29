import inherits from 'inherits';

import {
  pick,
  assign
} from 'min-dash';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import {
  add as collectionAdd,
  remove as collectionRemove
} from 'diagram-js/lib/util/Collections';

/**
 * A handler responsible for updating the custom element's businessObject
 * once changes on the diagram happen.
 */
function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

export default function CustomUpdater(eventBus, bpmnjs) {

  CommandInterceptor.call(this, eventBus);
  var activity_count = 0;
  var transiction_count = 0;
  var article_count = 0;
  var repository_count = 0;

  function loadCounters(){
    console.log(bpmnjs)
    if( bpmnjs['_customElements'] && activity_count === 0 && transiction_count===0){
      for(const item of bpmnjs['_customElements']){
        if( item.activity_count > activity_count){
          activity_count = item.activity_count;
        }
        else if( item.transiction_count > transiction_count){
          transiction_count = item.transiction_count;
        }
        else if( item.repository_count > repository_count){
          repository_count = item.repository_count;
        }
      }
    }
    
  }

  function updateCustomElement(e) {
    loadCounters();
    var context = e.context,
        shape = context.shape,
        businessObject = shape.businessObject;

    if (!isCustom(shape)) {
      return;
    }
    
    if( businessObject.activity_count ){
      activity_count = businessObject.activity_count;
    }
    else if( businessObject.transiction_count ){
      transiction_count = businessObject.transiction_count;
    } else if( businessObject.article_count ){
      article_count = businessObject.article_count;
    }

    if(businessObject.type === "custom:atividadeComposta" && !businessObject.uuid){
      businessObject.uuid = create_UUID();
    }
    else if((businessObject.type === "custom:atividadeBasica" || businessObject.type === "custom:start" 
            || businessObject.type === "custom:end") && !businessObject.name){
      activity_count++;
      shape.name = `Atividade ${activity_count}`;
      businessObject.name = `Atividade ${activity_count}`;
      businessObject.activity_count = activity_count;
    }
    else if( businessObject.type === "custom:transicao" && !businessObject.name ){
      transiction_count++;
      shape.name = `Atividade ${transiction_count}`;
      businessObject.name = `Transição ${transiction_count}`;
      businessObject.transiction_count = transiction_count;
    }
    else if( businessObject.type === "custom:evento" && !businessObject.name ){
      article_count++;
      shape.name = `Evento ${article_count}`;
      businessObject.name = `Evento ${article_count}`;
      businessObject.article_count = article_count;
    }
    else if( businessObject.type === "custom:repositorio" && !businessObject.name ){
      repository_count++;
      shape.name = `Repositório ${repository_count}`;
      businessObject.name = `Repositório ${repository_count}`;
      businessObject.repository_count = repository_count;
    }
      
    var parent = shape.parent;

    var customElements = bpmnjs._customElements;

    // make sure element is added / removed from bpmnjs.customElements
    if (!parent) {
      collectionRemove(customElements, businessObject);
    } else {
      collectionAdd(customElements, businessObject);
    }

    // save custom element position
    assign(businessObject, pick(shape, [ 'x', 'y' ]));
  }

  function updateCustomConnection(e) {

    var context = e.context,
        connection = context.connection,
        source = connection.source,
        target = connection.target,
        businessObject = connection.businessObject;

    var parent = connection.parent;

    var customElements = bpmnjs._customElements;

    // make sure element is added / removed from bpmnjs.customElements
    if (!parent) {
      collectionRemove(customElements, businessObject);
    } else {
      collectionAdd(customElements, businessObject);
    }

    // update waypoints
    assign(businessObject, {
      waypoints: copyWaypoints(connection)
    });

    if (source && target) {
      assign(businessObject, {
        source: source.id,
        target: target.id
      });
    }
  }

  this.executed([
    'shape.create',
    'shape.move',
    'shape.delete'
  ], ifCustomElement(updateCustomElement));

  this.reverted([
    'shape.create',
    'shape.move',
    'shape.delete'
  ], ifCustomElement(updateCustomElement));

  this.executed([
    'connection.create',
    'connection.reconnectStart',
    'connection.reconnectEnd',
    'connection.updateWaypoints',
    'connection.delete',
    'connection.layout',
    'connection.move'
  ], ifCustomElement(updateCustomConnection));

  this.reverted([
    'connection.create',
    'connection.reconnectStart',
    'connection.reconnectEnd',
    'connection.updateWaypoints',
    'connection.delete',
    'connection.layout',
    'connection.move'
  ], ifCustomElement(updateCustomConnection));

}

inherits(CustomUpdater, CommandInterceptor);

CustomUpdater.$inject = [ 'eventBus', 'bpmnjs' ];


/////// helpers ///////////////////////////////////

function copyWaypoints(connection) {
  return connection.waypoints.map(function(p) {
    return { x: p.x, y: p.y };
  });
}

function isCustom(element) {
  return element && /custom:/.test(element.type);
}

function ifCustomElement(fn) {
  return function(event) {
    var context = event.context,
        element = context.shape || context.connection;

    if (isCustom(element)) {
      fn(event);
    }
  };
}