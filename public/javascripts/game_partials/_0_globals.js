var stage, w, h, loader;
var sky, sun, clouds, road, buildings, backBg, frontBg, ambulance, speed = 100, time,
  hitFlags = {}, playVol = 0.1, effectVolRatio = 0.25,
  createTreeStrip, addTrees, treeStrip, ditch, buildings, ptokens, ntokens, sound, flag = true;
var score = {
  value: 0,
  ob: {}
};
var star = {
  value: 0,
  ob: {}
};
var paused = false;
var tokensCaught = 0;

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
  src: "building-sprite.png",
  id: "building"
}, {
  src: "ambulance-sprite.png",
  id: "amb"
}, {
  src: "star-sprite.png",
  id: "star"
}, {
  src: "ditch.png",
  id: "ditch"
}, {
  src: "positive-sprite.png",
  id: "ptoken"
}, {
  src: "negative-sprites.png",
  id: "ntoken"
}];
