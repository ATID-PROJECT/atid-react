import inherits from 'inherits';
import barrir from "assets/img/barrir.png";
import quizImage from "assets/img/quiz.png";
import chatImage from "assets/img/chat.png";
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  componentsToPath,
} from 'diagram-js/lib/util/RenderUtil';

import {
  assign,
} from 'min-dash';

import {
  query as domQuery,
} from 'min-dom';

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  classes as svgClasses,
  innerSVG,
} from 'tiny-svg';

import Ids from 'ids';
/**
 * A renderer that knows how to render custom elements.
 */
export default function CustomRenderer(config, canvas, eventBus, styles, textRenderer) {

  var RENDERER_IDS = new Ids();
  var rendererId = RENDERER_IDS.next();
  var markers = {};

  var defaultFillColor = config && config.defaultFillColor,
  defaultStrokeColor = config && config.defaultStrokeColor;

  BaseRenderer.call(this, eventBus, 2000);
  this.CONNECTION_STYLE = styles.style([ 'no-fill' ], { strokeWidth: 5, stroke: 'fuchsia' });
  
  var computeStyle = styles.computeStyle;

  function getFillColor(element, defaultColor) {
    return defaultColor || 'white';
  }
  
  function getStrokeColor(element, defaultColor) {
    return defaultColor || 'black';
  }

  function getSemantic(element) {
    return element.businessObject;
  }

  function getPositionLabel(type)
  {
    switch(type){
      case "custom:transicao":
        return 74;
      case "custom:end":
        return 55;
      case "custom:start":
        return 55;
      default:
        return 55;
    }
  }

  function renderLabel(parentGfx, label, options) {

    options = assign({
      getDefaultStyle:{
        y:200
      },
      size: {
        width: 100
      },
    }, options);
    const title = label || '';
    var text = textRenderer.createText(title, options);
    
    svgClasses(text).add('djs-label');
    innerSVG(text, `<tspan x="2.5" y="${getPositionLabel(options.box.type)}">${title}</tspan>`)

    svgAppend(parentGfx, text);

    return text;
}

  function renderEmbeddedLabel(parentGfx, element, align) {
    var semantic = getSemantic(element);

      return renderLabel(parentGfx, semantic.name, {
        box: element,
        align: align,
        margin: 5,
        style: {
          fill: getStrokeColor(element, defaultStrokeColor),
        }
      });
}



  this.drawTriangle = function(p, element, side) {
    var halfSide = side / 2,
        points,
        attrs;

    points = [ 0, 0, side, 0, halfSide, side ];

    attrs = computeStyle(attrs, {
      stroke: '#000',
      strokeWidth: 2,
      fill: '#fff'
    });

    var polygon = svgCreate('polygon');

    svgAttr(polygon, {
      points: points
    });

    svgAttr(polygon, attrs);

    svgAppend(p, polygon);
    renderEmbeddedLabel(p, element, 'bottom');
    
    return polygon;
  };

  this.getTrianglePath = function(element) {
    var x = element.x,
        y = element.y,
        width = element.width,
        height = element.height;

    var trianglePath = [
      ['M', x + width / 2, y],
      ['l', width / 2, height],
      ['l', -width, 0 ],
      ['z']
    ];



    return componentsToPath(trianglePath);
  };

  this.drawMinCircle = function (p, width, height, stroke, color, aux, aux2) {
    var cx = width / aux,
        cy = height / aux;

    var attrs = computeStyle({
      stroke: stroke,
      strokeWidth: 2,
      fill: color
    });

    var circle = svgCreate('circle');

    svgAttr(circle, {
      cx: cx,
      cy: cy,
      r: Math.round((width/aux2 + height/aux2) / 4)
    });

    svgAttr(circle, attrs);

    svgAppend(p, circle);

    return circle;
  };

  function getImage( type )
  {
    var ctype = type ? type.toLowerCase() : "";
    var myImage;

    if( ctype === "quiz")
    {
      myImage = quizImage;
    }
    else if( ctype === "chat")
    {
      myImage = chatImage;
    }
    else{
      myImage = quizImage;
    }
    return myImage;
  }

  this.drawActivity = function(p, element, side){
    var points;
    const myImage = getImage( element.suggestion_type);

    points = [ 0, 0, side, 0, side, side*1.5, 0, side*1.5  ];
    
    var polygon = svgCreate("image", {
      x: 0,
      y: 0,
      width: element.width,
      height: element.height,
      href: myImage
  });

    svgAttr(polygon, {
      points: points
    });
  

    svgAppend(p, polygon);

    renderEmbeddedLabel(p, element, 'bottom');

    return polygon;
  }

  this.drawTransiction = function (p, element, side) {
    var points;

    points = [ 0, 0, side, 0, side, side*1.5, 0, side*1.5  ];
    
    var polygon = svgCreate("image", {
      x: 0,
      y: 0,
      width: element.width,
      height: element.height,
      href: barrir
  });

    svgAttr(polygon, {
      points: points
    });
  

    svgAppend(p, polygon);

    renderEmbeddedLabel(p, element, 'bottom');

    return polygon;
  }

  this.drawCircle = function(p, element, width, height, stroke, fill) {
    var cx = width / 2,
        cy = height / 2;

    var attrs = computeStyle({
      stroke: stroke,
      strokeWidth: 3,
      fill: fill
    });

    var circle = svgCreate('circle');

    svgAttr(circle, {
      cx: cx,
      cy: cy,
      r: Math.round((width + height) / 4)
    });

    svgAttr(circle, attrs);

    svgAppend(p, circle);
    
  
    renderEmbeddedLabel(p, element, 'bottom');

      

    return circle;
  };

  this.getCirclePath = function(shape) {
    var cx = shape.x + shape.width / 2,
        cy = shape.y + shape.height / 2,
        radius = shape.width / 2;

    var circlePath = [
      ['M', cx, cy],
      ['m', 0, -radius],
      ['a', radius, radius, 0, 1, 1, 0, 2 * radius],
      ['a', radius, radius, 0, 1, 1, 0, -2 * radius],
      ['z']
    ];

    return componentsToPath(circlePath);
  };

  this.createLine = function (points, attrs) {

    var line = svgCreate('polyline');
    svgAttr(line, { points: this.toSVGPoints(points) });

    if (attrs) {
      svgAttr(line, attrs);
    }
    
    //points[1].x
    //points[1].y

    return line;
  }

  this.toSVGPoints = function (points) {
    var result = '';
  
    for (var i = 0, p; (p = points[i]); i++) {
      result += p.x + ',' + p.y + ' ';
    }
  
    return result;
  }

  this.createPathFromConnection = function(connection) {
    var waypoints = connection.waypoints;

    var pathData = 'm  ' + waypoints[0].x + ',' + waypoints[0].y;
    for (var i = 1; i < waypoints.length; i++) {
      pathData += 'L' + waypoints[i].x + ',' + waypoints[i].y + ' ';
    }
    return pathData;
}

function addMarker(id, options) {
  var attrs = assign({
    fill: 'black',
    strokeWidth: 1,
    strokeLinecap: 'round',
    strokeDasharray: 'none'
  }, options.attrs);

  var ref = options.ref || { x: 0, y: 0 };

  var scale = options.scale || 1;

  // fix for safari / chrome / firefox bug not correctly
  // resetting stroke dash array
  if (attrs.strokeDasharray === 'none') {
    attrs.strokeDasharray = [10000, 1];
  }

  var marker = svgCreate('marker');

  svgAttr(options.element, attrs);

  svgAppend(marker, options.element);

  svgAttr(marker, {
    id: id,
    viewBox: '0 0 20 20',
    refX: ref.x,
    refY: ref.y,
    markerWidth: 20 * scale,
    markerHeight: 20 * scale,
    orient: 'auto'
  });

  var defs = domQuery('defs', canvas._svg);

  if (!defs) {
    defs = svgCreate('defs');

    svgAppend(canvas._svg, defs);
  }

  svgAppend(defs, marker);

  markers[id] = marker;
}

function createMarker(type, fill, stroke) {
  var id = type + '-' + fill + '-' + stroke + '-' + rendererId;

  if (type === 'sequenceflow-end') {
      var sequenceflowEnd = svgCreate('path');
      svgAttr(sequenceflowEnd, { d: 'M 1 5 L 11 10 L 1 15 Z' });

      addMarker(id, {
        element: sequenceflowEnd,
        ref: { x: 11, y: 10 },
        scale: 0.5,
        attrs: {
          fill: stroke,
          stroke: stroke
        }
      });
  }
    return null;
  }

  function createPathFromConnection(connection) {
    var waypoints = connection.waypoints;

    var pathData = 'm  ' + waypoints[0].x + ',' + waypoints[0].y;
    for (var i = 1; i < waypoints.length; i++) {
      pathData += 'L' + waypoints[i].x + ',' + waypoints[i].y + ' ';
    }
    return pathData;
}

function drawPath(parentGfx, d, attrs) {

  attrs = computeStyle(attrs, [ 'no-fill' ], {
    strokeWidth: 2,
    stroke: 'black'
  });

  var path = svgCreate('path');
  svgAttr(path, { d: d });
  svgAttr(path, attrs);

  svgAppend(parentGfx, path);

  return path;
}

  this.drawCustomConnection = function(p, element) {
    var pathData = createPathFromConnection(element);

      var fill = getFillColor(element, defaultFillColor),
          stroke = getStrokeColor(element, defaultStrokeColor);

      var attrs = {
        strokeLinejoin: 'round',
        markerEnd: marker('sequenceflow-end', fill, stroke),
        stroke: getStrokeColor(element, defaultStrokeColor)
      };

    var path = drawPath(p, pathData, attrs);

    return path;
  };

  function marker(type, fill, stroke) {
    var id = type + '-' + fill + '-' + stroke + '-' + rendererId;

    if (!markers[id]) {
      createMarker(type, fill, stroke);
    }

    return 'url(#' + id + ')';
}

  this.createPathFromConnection = function (connection) {
    var waypoints = connection.waypoints;

    var pathData = 'm  ' + waypoints[0].x + ',' + waypoints[0].y;
    for (var i = 1; i < waypoints.length; i++) {
      pathData += 'L' + waypoints[i].x + ',' + waypoints[i].y + ' ';
    }
    return pathData;
}

  this.getCustomConnectionPath = function(connection) {
    var waypoints = connection.waypoints.map(function(p) {
      return p.original || p;
    });

    var connectionPath = [
      ['M', waypoints[0].x, waypoints[0].y]
    ];

    waypoints.forEach(function(waypoint, index) {
      if (index !== 0) {
        connectionPath.push(['L', waypoint.x, waypoint.y]);
      }
    });

    return componentsToPath(connectionPath);
  };
}

inherits(CustomRenderer, BaseRenderer);

CustomRenderer.$inject = [ 'config.bpmnRenderer', 'canvas' ,'eventBus', 'styles','textRenderer' ];

CustomRenderer.prototype.canRender = function(element) {
  return /^custom:/.test(element.type);
};

CustomRenderer.prototype.drawShape = function(p, element) {
  var type = element.type;
  
  if (type === 'custom:evento') {
    return this.drawTriangle(p, element, element.width);
  }

  if (type === 'custom:repositorio') {
    return this.drawCircle(p, element, element.width, element.height,'#000', '#fff');
  }

  if (type === 'custom:circle') {
    return this.drawCircle(p, element, element.width, element.height,'#F92869', '#fff');
  }

  if (type === 'custom:end') {
    this.drawCircle(p, element, element.width, element.height,'#F92869', '#fff');
    return this.drawMinCircle(p, element.width, element.height,'#F92869', '#fff', 2, 1.5);
  }

  if (type === 'custom:atividadeBasica') {
    return this.drawActivity(p, element, element.width );
  }

  if (type === 'custom:atividadeComposta') {
    this.drawCircle(p, element, element.width, element.height,'#000', '#fff');
    this.drawMinCircle(p, element.width, element.height, '#000', '#fff', 2, 1.5);
    return this.drawMinCircle(p, element.width, element.height, '#000', '#fff', 2, 2.5);
  }

  if( type === 'custom:start') {
    this.drawCircle(p, element, element.width, element.height,'#F92869', '#fff');
    return this.drawMinCircle(p, element.width, element.height, '#F92869','#F92869', 2, 1.5);
  }

  if( type === 'custom:transicao' ) {
    return this.drawTransiction(p, element, element.width );
  }
};

CustomRenderer.prototype.getShapePath = function(shape) {
  var type = shape.type;

  if (type === 'custom:evento') {
    //return this.getTrianglePath(shape);
  }

  if (type === 'custom:circle') {
    return this.getCirclePath(shape);
  }

  if (type === 'custom:end') {
    return this.getCirclePath(shape);
  }

  if (type === 'custom:start') {
    return this.getCirclePath(shape);
  }

};

CustomRenderer.prototype.drawConnection = function(p, element) {

  var type = element.type;

  if (type === 'custom:connection') {
    
    return this.drawCustomConnection(p, element);
  }

  if (type === 'sequenceflow-end') {
    var sequenceflowEnd = svgCreate('path');
   
    svgAttr(sequenceflowEnd, { d: 'M 1 5 L 11 10 L 1 15 Z' });

    this.get('canvas').addMarker(element.id, {
      element: sequenceflowEnd,
      ref: { x: 11, y: 10 },
      scale: 0.5,
      attrs: {
        fill: 'none',
        stroke: 'black'
      }
    });
  }
};


CustomRenderer.prototype.getConnectionPath = function(connection) {

  var type = connection.type;

  if (type === 'custom:connection') {
    return this.getCustomConnectionPath(connection);
  }
};
