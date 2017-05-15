var stage, w, h, loader;
var sky, sun, clouds, road, buildings, backBg, frontBg, ambulance, speed = 100,
  createTreeStrip, addTrees, treeStrip, ditch, buildings, tokens, sound, flag = true;
var score = {
  value: 0,
  ob: {}
};


stage = new createjs.Stage('game-holder');

// get canvas width and height for later calculations:
w = stage.canvas.width;
h = stage.canvas.height;

var IMAGES_HOLDER = [{
  src: "Sky.png",
  id: "sky"
}, {
  src: "Sun.png",
  id: "sun"
}, {
  src: "Buildings-Back.png",
  id: "backBg"
}, {
  src: "Buildings-Front.png",
  id: "frontBg"
}, {
  src: "Road.png",
  id: "road"
}, {
  src: "Clouds.png",
  id: "clouds"
}, {
  src: "tree-sprite.png",
  id: "tree"
}, {
  src: "Building-1.png",
  id: "building1"
}, {
  src: "Building-2.png",
  id: "building2"
}, {
  src: "Building-3.png",
  id: "building3"
}, {
  src: "ambulance-sprite.png",
  id: "amb"
}, {
  src: "Ditch.png",
  id: "ditch"
}, {
  src: "Token-1.png",
  id: "token1"
}, {
  src: "Token-2.png",
  id: "token2"
}
];

loader = new createjs.LoadQueue(false);