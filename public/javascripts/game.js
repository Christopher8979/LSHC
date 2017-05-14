$(document).on('initialize-game', function() {
  var stage, w, h, loader;
  var sky, sun, clouds, road, buildings, backBg, frontBg, ambulance, speed = 0,
    createTreeStrip, addTrees, treeStrip, updateTreeLocation, ditch;

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
    clouds.graphics.beginBitmapFill(cloudImg).drawRect(0, 0, cloudImg.width * 5, cloudImg.height);
    clouds.tileW = w - cloudImg.width;
    clouds.y = 0;

    //Initializing road
    var roadImg = loader.getResult("road");
    road = new createjs.Shape();
    road.graphics.beginBitmapFill(roadImg).drawRect(0, 0, roadImg.width * 30, roadImg.height);
    road.tileW = 0;
    road.y = h - roadImg.height;

    //Initializing backgrounds
    var backBgImg = loader.getResult("backBg");
    backBg = new createjs.Shape();
    backBg.graphics.beginBitmapFill(backBgImg).drawRect(0, 0, backBgImg.width * 30, backBgImg.height);
    backBg.regX = w * 15;
    backBg.y = h - (backBgImg.height + roadImg.height);

    //Initializing backgrounds
    var frontBgImg = loader.getResult("frontBg");
    frontBg = new createjs.Shape();
    frontBg.graphics.beginBitmapFill(frontBgImg).drawRect(0, 0, frontBgImg.width * 30, frontBgImg.height);
    frontBg.regX = w * 15;
    frontBg.y = h - (frontBgImg.height + roadImg.height);

    function createBuildingStrip() {
      return [];
    };
    var buildings = createBuildingStrip();

    // Method to get tree objects to be added on road
    createTreeStrip = function() {
      var refObj = ["tree1", "tree2", "tree3"];

      var refImg, layer, layers = [];
      refObj.forEach(function(item) {
        refImg = loader.getResult(item);
        layer = new createjs.Shape();
        layer.graphics.beginBitmapFill(refImg).drawRect(0, 0, refImg.width, refImg.height);
        layer.x = (Math.random() * (w * 0.8) + (w * 0.1));
        layer.y = h - (roadImg.height + refImg.height) + 2;

        layers.push(layer);
      });
      return layers;
    };

    addTrees = function() {
      treeStrip = createTreeStrip();
      treeStrip.forEach(function(tree) {
        stage.addChild(tree);
      });
    }

    updateTreeLocation = function(index, tree) {
      var refObj = ["tree1", "tree2", "tree3"];

      var treeImage = loader.getResult(refObj[index]);
      tree = new createjs.Shape();
      tree.graphics.beginBitmapFill(treeImage).drawRect(0, 0, treeImage.width, treeImage.height);
      tree.x = w + (Math.random() * (w * 0.8) + (w * 0.1));
      tree.y = h - (roadImg.height + treeImage.height) + 2;
    }

    // Adding layers based on their sequence
    stage.addChild(sky, sun, clouds, backBg, frontBg, road);

    buildings.forEach(function(building) {
      stage.addChild(building);
    });

    addTrees();


    var ambulanceImg = loader.getResult('amb');
    ambulance = new createjs.Shape();
    ambulance.graphics.beginBitmapFill(ambulanceImg).drawRect(0, 0, ambulanceImg.width, ambulanceImg.height);
    ambulance.x = 0.1 * w;
    ambulance.y = h - (ambulanceImg.height + (roadImg.height / 2));
    stage.addChild(ambulance);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.interval = 100;
    createjs.Ticker.addEventListener("tick", tickHandler);
  };


  function tickHandler(event) {

    // console.log(event);
    var deltaS = event.delta / 1000;
    var maxSpeed = 1000;


    // Animating clouds irrespective of background
    createjs.Tween.get(clouds).to({
      x: w
    }, 800000);

    createjs.Tween.get(backBg, {
      loop: true
    }).to({
      x: -w
    }, speed * 500);

    createjs.Tween.get(frontBg, {
      loop: true
    }).to({
      x: -w
    }, speed * 300);

    createjs.Tween.get(road, {
      loop: true
    }).to({
      x: -w
    }, speed * 45);


    treeStrip.forEach(function(tree, treeIndex) {
      createjs.Tween.get(tree, {
        loop: true
      }).to({
        x: -w
      }, speed * 45).call(function() {
        updateTreeLocation(treeIndex, tree)
      });
    });

    stage.update(event);
  }


  function handleSpeed(e) {
    // 39 - right arrow
    // 37 - left arrow
    if (e.keyCode === 39 || e.keyCode === 37) {
      if (speed === 0) {
        speed = 50;
      }

      if (speed > 10 && speed < 80) {


        if (e.keyCode === 39) {
          speed = speed - 6;
        }


        if (e.keyCode === 37) {
          speed = speed + 3;
        }

        stage.update();

        if (speed < 10) {
          speed = 10
        }
        if (speed > 80) {
          speed = 80
        }
      }
      // console.log('speed');
      // console.log(speed);
    }
  }


  $(window).on('keydown', handleSpeed);
  /**
   * Create background
   *  - Done:: have global variables for height and width of canvas
   *  - Done:: sky
   *  - Done:: sun
   *  - Done:: clouds (at its own pace)
   *  - Done:: buildings backgrounds(3 layers at their own pace)
   *  - Done:: create building scquence randomly on load and have it as a background
   *  - Done:: road
   *  - diches(each ditch should have a configuration for pop up)
   *  - sprite for ambulance.(jerk on hitting dich, indication of poinits on catching items, direction change, moment of ambulance)
   *  - have all the above movements driven with variables that will later be adjusted with key press
   *  - configure items falling from the screen.(sprites)
   *  - key press should increase or decrease a speed variable that will controll complete canvas(this shouldnot efect speed of the items falling)
   */
  // console.log(stage);
});
