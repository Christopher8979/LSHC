$(document).on('initialize-game', function() {
  var stage, w, h, loader;
  var sky, sun, clouds, road, buildings, backBg, frontBg, ambulance;

  stage = new createjs.Stage('game-holder');

  // get canvas width and height for later calculations:
  w = stage.canvas.width;
  h = stage.canvas.height;

  var IMAGES_HOLDER = [{
      src: "Sky.png",
      id: "sky"
    },
    {
      src: "Sun.png",
      id: "sun"
    },
    {
      src: "Buildings-Back.png",
      id: "backBg"
    },
    {
      src: "Buildings-Front.png",
      id: "frontBg"
    },
    {
      src: "Road.png",
      id: "road"
    },
    {
      src: "Clouds.png",
      id: "clouds"
    }, {
      src: "Trees-1.png",
      id: "tree1"
    }, {
      src: "Trees-2.png",
      id: "tree2"
    }, {
      src: "Trees-3.png",
      id: "tree3"
    }, {
      src: "Ambulance.png",
      id: "amb"
    }
  ];

  loader = new createjs.LoadQueue(false);
  loader.addEventListener("complete", handleComplete);
  loader.loadManifest(IMAGES_HOLDER, true, "../images/");

  function handleComplete(e) {
    // console.log(e);
    // Adding sky as background
    sky = new createjs.Shape();
    sky.graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0, 0, w, h);

    // Adding sun in sky
    var sunImg = loader.getResult("sun");
    sun = new createjs.Shape();
    sun.graphics.beginBitmapFill(sunImg).drawRect(sunImg.width, 0, sunImg.width, sunImg.height);
    sun.y = sunImg.height * 0.2;
    sun.x = Math.random() * (w - (sunImg.width * 2));

    // Adding clouds in sky
    var cloudImg = loader.getResult("clouds");
    clouds = new createjs.Shape();
    clouds.graphics.beginBitmapFill(cloudImg).drawRect(0, 0, cloudImg.width, cloudImg.height);
    clouds.tileW = w - cloudImg.width;
    clouds.y = 0;

    var roadImg = loader.getResult("road");
    road = new createjs.Shape();
    road.graphics.beginBitmapFill(roadImg).drawRect(0, 0, roadImg.width * 30, roadImg.height * 30);
    road.tileW = 0;
    road.y = h - roadImg.height;

    var backBgImg = loader.getResult("backBg");
    backBg = new createjs.Shape();
    backBg.graphics.beginBitmapFill(backBgImg).drawRect(0, 0, backBgImg.width * 30, backBgImg.height * 30);
    backBg.regX = w * 15;
    backBg.y = h - (backBgImg.height + roadImg.height);

    var frontBgImg = loader.getResult("frontBg");
    frontBg = new createjs.Shape();
    frontBg.graphics.beginBitmapFill(frontBgImg).drawRect(0, 0, frontBgImg.width * 30, frontBgImg.height * 30);
    frontBg.regX = w * 15;
    frontBg.y = h - (frontBgImg.height + roadImg.height);

    function createBuildingStrip() {
      return [];
    };

    function createTreeStrip() {
      var refObj = ["tree1", "tree2", "tree3"];

      var refImg, layer, layers = [];
      refObj.forEach(function(item) {
        refImg = loader.getResult(item);
        layer = new createjs.Shape();
        layer.graphics.beginBitmapFill(refImg).drawRect(0, 0, refImg.width, refImg.height);
        layer.x = Math.random() * (w * 0.8) + (w * 0.1);
        layer.y = h - (roadImg.height + refImg.height) + 2;

        layers.push(layer);
      });
      return layers;
    };


    var buildings = createBuildingStrip();
    var treeStrip = createTreeStrip();

    stage.addChild(sky, sun, clouds, backBg, frontBg, road);
    buildings.forEach(function(building) {
      stage.addChild(building);
    });

    treeStrip.forEach(function(tree) {
      stage.addChild(tree);
    });


    var ambulanceImg = loader.getResult('amb');
    ambulance = new createjs.Shape();
    ambulance.graphics.beginBitmapFill(ambulanceImg).drawRect(0, 0, ambulanceImg.width, ambulanceImg.height);
    ambulance.x = 0.1 * w;
    ambulance.y = h - (ambulanceImg.height + (roadImg.height / 2));
    stage.addChild(ambulance);

    stage.addEventListener("pressup", handleSpeed);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tickHandler);
  };


  function tickHandler(event) {

    // console.log(event);
    var deltaS = event.delta / 1000;


    var speed = 100;
    // Animating clouds irrespective of background
    createjs.Tween.get(clouds).to({
      x: w
    }, 80 * speed * speed);

    createjs.Tween.get(backBg, {
      loop: true
    }).to({
      x: -w
    }, speed * speed * 10);

    createjs.Tween.get(frontBg, {
      loop: true
    }).to({
      x: -w
    }, speed * speed * 6);

    createjs.Tween.get(road, {
      loop: true
    }).to({
      x: -w
    }, speed * speed * 0.9);


    stage.update(event);
  }


  function handleSpeed(e) {
    console.log('key press event');
    console.log(e);
  }

  $(window).on('keydown', handleSpeed);
  /**
   * Create background
   *  - have global variables for height and width of canvas
   *  - sky
   *  - sun
   *  - clouds (at its own pace)
   *  - buildings backgrounds(3 layers at their own pace)
   *  - create building scquence randomly on load and have it as a background
   *  - road
   *  - diches(each ditch should have a configuration for pop up)
   *  - sprite for ambulance.(jerk on hitting dich, indication of poinits on catching items, direction change, moment of ambulance)
   *  - have all the above movements driven with variables that will later be adjusted with key press
   *  - configure items falling from the screen.(sprites)
   *  - key press should increase or decrease a speed variable that will controll complete canvas(this shouldnot efect speed of the items falling)
   */
  // console.log(stage);
});
