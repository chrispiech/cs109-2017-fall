// Matter.js module aliases
var Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  Vector = Matter.Vector;

// variables
var width = 750,
  height = 530,
  borderWidth = 20,
  hexYOffset = 50,
  hexXOffset = 350,
  hexYSpacing = 38,
  hexXSpacing = 44,
  hexSize = 20,
  boundaryHexSize = 27,
  hexChamfer = 3,
  ballPyramidRows = 16,
  ballPyramidColumns = 24,
  ballSize = 3.25,
  ballFriction = 0,
  ballBounciness = .25;

var boundaryStyle = {
  fillStyle: '#F0F0F0',
  strokeStyle: 'transparent'
};

var transparentStyle = {
  fillStyle: '#222',
  strokeStyle: 'transparent'
};

var ballStyle = {
  fillStyle: '#85c226',
  strokeStyle: '#222'
};

var wallStyle = {
  fillStyle: 'transparent',
  strokeStyle: 'transparent'
};

var engine = Engine.create({
  render: {
    element: document.getElementById("player"),
    options: {
      height: height,
      width: width,
      background: 'transparent'
    }
  }
});

var balls = Composites.pyramid(0, 0, ballPyramidColumns, ballPyramidRows, 0, 0, function(x, y) {
  return Bodies.circle(x, y, ballSize, {
    render: ballStyle,
    friction: ballFriction,
    restitution: ballBounciness
  });
});

Composite.rotate(balls, Math.PI, Vector.create(225, hexYOffset));

var hexes = [];

for (var i = 2; i < 11; i++) {
  for (var j = i; j > 0; j--) {
    var y = hexYOffset + (hexYSpacing * i),
      x = hexXOffset + ((hexXSpacing * j) - ((hexXSpacing / 2) * i)),
      size,
      style;
    if (j == 1 || j == i) {
      var direction = (j == 1) ? -1 : 1;
      x += direction * (boundaryHexSize / 4);
      y -= 4;
      size = boundaryHexSize;
      style = transparentStyle;
    } else {
      size = hexSize;
      style = boundaryStyle;
    }
    hexes.push(Bodies.polygon(x, y, 6, size, {
      isStatic: true,
      render: style,
      chamfer: {
        radius: hexChamfer
      }
    }));
  }
}

var tubes = [];

for (var i = 0; i < 10; i++) {
  tubes.push(Bodies.rectangle(174 + (i * hexXSpacing), 470, 32, 100, {
    isStatic: true,
    render: transparentStyle
  }));
}

//funnel
World.add(engine.world, Bodies.rectangle(310, 60, 30, 150, {
  isStatic: true,
  angle: Math.PI * -0.2,
  render: transparentStyle
}));
World.add(engine.world, Bodies.rectangle(434, 60, 30, 150, {
  isStatic: true,
  angle: Math.PI * 0.2,
  render: transparentStyle
}));

World.add(engine.world, tubes);

World.add(engine.world, hexes);

World.add(engine.world, balls);

// add boundaries
World.add(engine.world, [
  Bodies.rectangle(372, 0, 237, borderWidth, {
    isStatic: true,
    render: transparentStyle
  }),
  Bodies.rectangle(372, height, 430, borderWidth, {
    isStatic: true,
    render: transparentStyle
  }),
  Bodies.rectangle(width, 300, borderWidth, 600, {
    isStatic: true,
    render: wallStyle
  }),
  Bodies.rectangle(0, 300, borderWidth, 600, {
    isStatic: true,
    render: wallStyle
  })
]);

var renderOptions = engine.render.options;
renderOptions.wireframes = false;

// run the engine
Engine.run(engine);

$('#gravity').change(function(e) {
  engine.world.gravity.y = e.target.value;
});

function flip() {
  $('canvas').toggleClass('flip');
  engine.world.gravity.y = -1 * engine.world.gravity.y;
}