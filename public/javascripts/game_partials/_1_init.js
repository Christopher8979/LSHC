$(document).on('initialize-game', function () {

    if (localStorage.getItem('player') === null) {
        location.href = '/';
    }

    stage = new createjs.Stage('game-holder');

    // get canvas width and height for later calculations:
    w = stage.canvas.width;
    h = stage.canvas.height;

    loader = new createjs.LoadQueue(false);

    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(IMAGES_HOLDER, true, "../images/");

    // Sounds
    var soundFiles = [
        { path: "../audio/bg-music.mp3", key: "music", type: "mp3", main: true },
        { path: "../audio/got-item.mp3", key: "plusSound", type: "mp3" },
        { path: "../audio/lost-item.mp3", key: "minusSound", type: "mp3" }
    ]

    soundFiles.forEach(function(tune) {
        createjs.Sound.alternateExtensions = [tune.type];

        // Play the main track on loop
        if (tune.main) {
            createjs.Sound.on("fileload", function () {
                sound = createjs.Sound.play(tune.key, { interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0});
            }, this);
        }

        createjs.Sound.registerSound(tune.path, tune.key);
    }, this);

    // Manifest Loading complete handler
    function handleComplete(e) {

        // Removing loading symbol
        $('.preloader').removeClass('loading');
        $('.preloader .preloader-wrapper').removeClass('active');

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

        var building = {
            id: "building", width: 274, height: 126, number: 3
        };
        buildings = [];

        var buildingSpriteSheet = new createjs.SpriteSheet({
            images: [loader.getResult(building.id)],
            frames: { width: building.width, height: building.height },
        });

        for (var buildIndex = 0; buildIndex <= building.number; buildIndex++) {
            var sprite = new createjs.Sprite(buildingSpriteSheet);
            var spriteBounds = buildingSpriteSheet.getFrameBounds(buildIndex);
            sprite.gotoAndStop(buildIndex);
            sprite.setTransform(Math.random() * w, h - (roadImg.height + spriteBounds.height) + 2);

            // Add to buildings
            buildings.push(sprite);
        }



        // Initialize Tree Sprite
        var treeSprite = new createjs.SpriteSheet({
            images: [loader.getResult("tree")],
            frames: { width: 100, height: 150 },
        });

        createTreeStrip = function () {
            var layers = [];
            for (var treeIndex = 0; treeIndex < 4; treeIndex++) {
                var tree = new createjs.Sprite(treeSprite);
                var treeBounds = treeSprite.getFrameBounds(treeIndex);
                tree.gotoAndStop(treeIndex);
                tree.setTransform(Math.random() * w, h - (roadImg.height + treeBounds.height) + 2);

                layers.push(tree);
            }
            return layers;
        }


        // Initialize abmulance sprite
        var spriteSheet = new createjs.SpriteSheet({
            framerate: 3,
            "images": [loader.getResult("amb")],
            "frames": { "regX": 0, "height": 150, "count": 15, "regY": 0, "width": 150 },
            "animations": {
                "run": [0, 4, "run", 1.5],
                "hickup": [5, 6, "run"],
                "plus": [7, 10, "run", 6],
                "minus": [11, 14, "run", 6]
            }
        });

        ambulance = new createjs.Sprite(spriteSheet, "run");
        ambulance.x = w * 0.1;
        ambulance.y = h - (roadImg.height * 3);
        ambulance.setBounds(0, 0, 150, 150);

        // Initialize tokens
        var ptokenSpriteSheet = new createjs.SpriteSheet({
            images: [loader.getResult("ptoken")],
            frames: { width: 47, height: 47 },
        });
        var ntokenSpriteSheet = new createjs.SpriteSheet({
            images: [loader.getResult("ntoken")],
            frames: { width: 47, height: 47 },
        });
        createTokens = function () {
            ptokens = [];
            for (var index = 1; index <= 4; index++) {
                var pSprite = new createjs.Sprite(ptokenSpriteSheet);
                // var pBounds = pSprite.getFrameBounds(index);
                pSprite.gotoAndStop(index);
                ptokens.push(pSprite);
            }
            ntokens = [];
            for (var index = 1; index <= 2; index++) {
                var nSprite = new createjs.Sprite(ntokenSpriteSheet);
                // var pBounds = pSprite.getFrameBounds(index);
                nSprite.gotoAndStop(index);
                ntokens.push(nSprite);
            }
        }

        // Initialize Score
        score.ob = new createjs.Text("POINTS:" + score.value, "30px monospace", "#00000");
        score.ob.x = 10;
        score.ob.y = 10;

        // Initialize Time
        time = new createjs.Text("00:00:00", "30px monospace", "#00000");
        time.x = w - 150;
        time.y = 10;

        // Initialize Stars
        var spriteSheet = new createjs.SpriteSheet({
            "images": [loader.getResult("star")],
            "frames": { "height": 27, "width": 112 }
        });
        star.ob = new createjs.Sprite(spriteSheet);
        star.ob.numFrames = spriteSheet.getNumFrames();
        star.ob.x = 10;
        star.ob.y = 50;

        // Adding layers based on their sequence
        stage.addChild(sky, sun, clouds, backBg, frontBg, road, ditch, score.ob, star.ob, time);

        treeStrip = createTreeStrip();
        treeStrip.forEach(function (tree) {
            stage.addChild(tree);
        });

        buildings.forEach(function (building) {
            stage.addChild(building);
        });

        createTokens();

        stage.addChild(ambulance);

        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.interval = 100;
        createjs.Ticker.on("tick", tickHandler);
        initTweens();
    };

});
