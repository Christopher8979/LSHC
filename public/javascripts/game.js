var stage, w, h, loader;
var sky, sun, clouds, road, buildings, backBg, frontBg, ambulance, speed = 100, hitFlags = {},
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
  src: "ditch.png",
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
$(document).on('initialize-game', function () {

    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(IMAGES_HOLDER, true, "../images/");

    // Sounds
    createjs.Sound.alternateExtensions = ["wav"];
    createjs.Sound.on("fileload", function () {
        sound = createjs.Sound.play("music", { interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.4 });
    }, this);
    createjs.Sound.registerSound("../audio/bg-music.wav", "music");

    // Manifest Loading complete handler
    function handleComplete(e) {
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
        clouds.graphics.beginBitmapFill(cloudImg).drawRect(0, 0, cloudImg.width * 5, cloudImg.height)
        clouds.x = - (cloudImg.width * 4);
        clouds.cache(0, 0, cloudImg.width * 5, cloudImg.height);

        //Initializing road
        var roadImg = loader.getResult("road");
        road = new createjs.Shape();
        road.graphics.beginBitmapFill(roadImg).drawRect(0, 0, roadImg.width * 2, roadImg.height);
        road.tileW = 0;
        road.y = h - roadImg.height;
        road.cache(0, 0, roadImg.width * 2, roadImg.height);

        //Initializing backgrounds
        var backBgImg = loader.getResult("backBg");
        backBg = new createjs.Shape();
        backBg.graphics.beginBitmapFill(backBgImg).drawRect(0, 0, backBgImg.width * 2, backBgImg.height);
        backBg.y = h - (backBgImg.height + roadImg.height);
        backBg.cache(0, 0, backBgImg.width * 2, backBgImg.height);

        //Initializing backgrounds
        var frontBgImg = loader.getResult("frontBg");
        frontBg = new createjs.Shape();
        frontBg.graphics.beginBitmapFill(frontBgImg).drawRect(0, 0, frontBgImg.width * 2, frontBgImg.height);
        frontBg.y = h - (frontBgImg.height + roadImg.height);
        frontBg.cache(0, 0, frontBgImg.width * 2, frontBgImg.height);

        // Initialize Ditch
        var ditchImg = loader.getResult("ditch");
        ditch = new createjs.Shape();
        ditch.graphics.beginBitmapFill(ditchImg).drawRect(0, 0, ditchImg.width, ditchImg.height);
        ditch.x = (0.5 + Math.random()) * w;
        ditch.y = h - (0.75 * roadImg.height);
        ditch.cache(0, 0, ditchImg.width, ditchImg.height);

        // Initialize buildings
        function createBuildingStrip() {
            var refObj = ["building1", "building2", "building3"];

            var refImg, layer, layers = [];
            refObj.forEach(function (item, itemIndex) {
                refImg = loader.getResult(item);
                layer = new createjs.Shape();
                layer.graphics.beginBitmapFill(refImg).drawRect(0, 0, refImg.width, refImg.height);
                layer.x = (Math.random() * (w * 0.8) + (w * 0.1));
                layer.y = h - (roadImg.height + refImg.height) + 2;
                layer.setBounds(0, 0, refImg.width, refImg.height);
                layer.cache(0, 0, refImg.width, refImg.height);

                layers.push(layer);
            });
            return layers;
        };

        // Initialize Tree Sprite
        var treeSprite = new createjs.SpriteSheet({
            images: [loader.getResult("tree")],
            frames: { width: 100, height: 150 },
        });

        createTreeStrip = function () {
            var layers = [];
            for (var treeIndex = 0; treeIndex < 4; treeIndex++) {
                var tree = new createjs.Sprite(treeSprite, treeIndex);
                var treeBounds = treeSprite.getFrameBounds(treeIndex);
                tree.setTransform(Math.random() * w, h - (roadImg.height + treeBounds.height) + 2);
                // tree.setBounds(0, 0, treeBounds.width, treeBounds.height);
                tree.cache(0, 0, treeBounds.width, treeBounds.height);

                layers.push(tree);
            }
            return layers;
        }


        // Initialize abmulance sprite
        var spriteSheet = new createjs.SpriteSheet({
            framerate: 3,
            "images": [loader.getResult("amb")],
            "frames": { "regX": 0, "height": 104, "count": 7, "regY": 0, "width": 150 },
            "animations": {
                "run": [0, 4, "run", 1.5],
                "hickup": [5, 6, "run"]
            }
        });

        ambulance = new createjs.Sprite(spriteSheet, "run");
        ambulance.x = w * 0.1;
        ambulance.y = h - (roadImg.height * 2);
        ambulance.setBounds(0, 0, 150, 104);

        // Initialize tokens
        createTokens = function () {
            var tokenCount = 1;
            tokens = [];
            while (loader.getResult("token" + tokenCount)) {
                token = loader.getResult("token" + tokenCount++);
                layer = new createjs.Shape();
                layer.graphics.beginBitmapFill(token).drawRect(0, 0, token.width, token.height);
                layer.notCollectd = true;
                tokens.push(layer);
            }
        }

        // Initialize Score
        score.ob = new createjs.Text("SCORE: " + score.value, "30px monospace", "#00000");
        score.ob.x = 10;
        score.ob.y = 10;

        // Adding layers based on their sequence
        stage.addChild(sky, sun, clouds, backBg, frontBg, road, ditch, score.ob);

        buildings = createBuildingStrip();
        buildings.forEach(function (building) {
            stage.addChild(building);
        });

        treeStrip = createTreeStrip();
        treeStrip.forEach(function (tree) {
            stage.addChild(tree);
        });

        createTokens();

        stage.addChild(ambulance);

        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.interval = 100;
        createjs.Ticker.on("tick", tickHandler);
        initTweens();
    };

});
function initTweens(params) {
    createjs.Tween.get(road, {
        loop: true
    }).to({
        x: -w
    }, speed * 45);

    createjs.Tween.get(clouds, {
        loop: true
    }).to({
        x: w
    }, speed * 5000);

    createjs.Tween.get(backBg, {
        loop: true
    }).to({
        x: -w
    }, speed * 500);

    createjs.Tween.get(frontBg, {
        loop: true
    }).to({
        x: -w
    }, speed * 80);
}
function tickHandler(event) {
    var deltaS = event.delta;
    var maxSpeed = 1000;
    var fSpeed = deltaS / 5; // foreground speed

    // Animate trees
    treeStrip.forEach(function (tree, treeIndex) {
        treeBounds = tree.getBounds();
        tree.x = ((tree.x + treeBounds.width) <= 0) ? tree.x = w + treeBounds.width + (Math.random() * w) : tree.x - fSpeed;
    });

    // Animate buildings
    buildings.forEach(function (building, itsIndex) {
        buildingBounds = building.getBounds();
        building.x = ((building.x + buildingBounds.width) <= 0) ? building.x = w + buildingBounds.width + (Math.random() * w) : building.x - fSpeed;
    });

    // Animate Ditch
    ditch.x = ((ditch.x + 200) < 0) ? w + (0.5 + Math.random()) * w : ditch.x - fSpeed;

    // Check if collsion has occured
    var pt = ditch.localToLocal(0, 0, ambulance);
    if (ambulance.hitTest(pt.x, pt.y)) {
        ambulance.gotoAndPlay("hickup");
        hitDitch(ditch);
    }

    // Randomly drop tokens
    if (Math.random() * 1000 > 980) {
        dropTokens();
    }

    // Check if token collected
    tokens.forEach(function (token) {
        var pt = token.localToLocal(20, 0, ambulance);
        if (ambulance.hitTest(pt.x, pt.y)) {
            tokenCollected(token);
        }
    }, this);

    // Update stage
    stage.update(event);
}
// Drop Tokens
dropTokens = function () {
    var tokenIndex = Math.floor(Math.random() * tokens.length - 1) + 1;
    var token = tokens[tokenIndex];

    // Check for animation
    if (token.isAnimating) { return; }
    token.isAnimating = true;
    token.notCollectd = true;

    token.x = Math.floor(Math.random() * w) + 1;
    token.y = - 200;
    stage.addChild(token);
    createjs.Tween.get(token).to({
        y: w
    }, speed * 45).call(function () {
        token.isAnimating = false
        stage.removeChild(token)
    })
}

// Token Collection Handler
tokenCollected = function (token) {
    stage.removeChild(token);
    if (token.notCollectd) {
        token.notCollectd = false;
        score.value = score.value + 10;
        score.ob.text = "SCORE: " + (score.value);
    }
}

// Encountered Ditch
hitDitch = function () {
    if(!hitFlags.ditch) {
        hitFlags.ditch = true;
        $(document).trigger("hit-ditch");
    }
}


function moveSprite(e) {
    // 39 - right arrow
    // 37 - left arrow
    if (e.keyCode === 39 || e.keyCode === 37) {

        if (e.keyCode === 39) {
            var bounds = ambulance.getBounds();
            createjs.Tween.get(ambulance).to({
                x: ((ambulance.x + bounds.width) < w) ? ambulance.x + 10 : ambulance.x
            }, 30);
        }


        if (e.keyCode === 37) {
            var bounds = ambulance.getBounds();
            createjs.Tween.get(ambulance).to({
                x: (ambulance.x > 0) ? ambulance.x - 10 : ambulance.x
            }, 30);
        }

    }
}

$(window).on('keydown', moveSprite);

// Sound
// Mute Button
$("#mute-btn").on("click", function () {
    sound.volume = (sound.volume == 0) ? 0.1 : 0;
})

$(document).on("hit-ditch", function () {
    console.log("HIT THE DITCH");
})