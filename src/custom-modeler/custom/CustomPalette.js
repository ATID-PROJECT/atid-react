import {
  assign
} from 'min-dash';


/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */
export default function PaletteProvider(palette, create, elementFactory, spaceTool, lassoTool) {

  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool'
];


PaletteProvider.prototype.getPaletteEntries = function(element) {

  var actions  = {},
      create = this._create,
      elementFactory = this._elementFactory;
      //lassoTool = this._lassoTool;


  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, '');

    return {
      group: group,
      className: className,
      title: title || 'Create ' + shortType,
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  assign(actions, {
    'create.start': createAction(
      'custom:start', 'custom', 'icon-custom-circle', 'Definir o início'
    ),
    'create.end': createAction(
      'custom:end', 'custom', 'icon-custom-end', 'Definir o final'
    ),
    'custom-separator': {
      group: 'custom',
      separator: true
    },
    'custom-transicao': createAction(
      'custom:transicao', 'custom', 'icon-custom-transicao', 'Criar uma condição'
    ),
    'custom-atividade-basica': createAction(
      'custom:atividadeBasica', 'event', 'icon-custom-atividade-basica', 'Criar uma atividade'
    ),
    'custom-atividade-composta': createAction(
      'custom:atividadeComposta', 'event', 'icon-custom-atividade-composta', 'Criar um sub-rede'
    ),
    'custom-repositorio': createAction(
      'custom:repositorio', 'event', 'icon-custom-repositorio', 'Criar um repositório'
    ),
    'custom-evento': createAction(
      'custom:evento', 'event', 'icon-custom-evento', 'Criar um evento'
    ),
  });

  return actions;
};
