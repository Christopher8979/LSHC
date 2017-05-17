var stage, w, h, loader;
var sky, sun, clouds, road, buildings, backBg, frontBg, ambulance, speed = 100,
  hitFlags = {},
  createTreeStrip, addTrees, treeStrip, ditch, buildings, tokens, sound, flag = true;
var score = {
  value: 0,
  ob: {}
};
var star = {
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
  src: "hospital-sprite.png",
  id: "hospital"
}, {
  src: "clinic-sprite.png",
  id: "clinic"
}, {
  src: "store-sprite.png",
  id: "store"
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
  src: "Token-1.png",
  id: "token1"
}, {
  src: "Token-2.png",
  id: "token2"
}];

loader = new createjs.LoadQueue(false);

$(document).on('initialize-game', function () {

    if (localStorage.getItem('player') === null) {
        location.href = '/';
    }

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

        // Initialize building sprite
        var refObj = [
            { id: "hospital", width: 350, height: 170 },
            { id: "clinic", width: 127, height: 96 },
            { id: "store", width: 148, height: 73 },
        ];
        buildings = [];
        refObj.forEach(function(building) {
            var spriteSheet = new createjs.SpriteSheet({
                images: [loader.getResult(building.id)],
                frames: { width: building.width, height: building.height },
            });

            var sprite = new createjs.Sprite(spriteSheet);
            var spriteBounds = spriteSheet.getFrameBounds(0);
            sprite.setTransform(Math.random() * w, h - (roadImg.height + spriteBounds.height) + 2);
            sprite.numFrames = spriteSheet.getNumFrames();

            // Add to buildings
            buildings.push(sprite);
        }, this);

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
        stage.addChild(sky, sun, clouds, backBg, frontBg, road, ditch, score.ob, star.ob);

        treeStrip = createTreeStrip();
        treeStrip.forEach(function (tree) {
            stage.addChild(tree);
        });

        // buildings = createBuildingStrip();
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

    if (event.paused) {return;}

    // Animate trees
    treeStrip.forEach(function (tree, treeIndex) {
        treeBounds = tree.getBounds();
        tree.x = ((tree.x + treeBounds.width) <= 0) ? tree.x = w + treeBounds.width + (Math.random() * w) : tree.x - fSpeed;
    });

    // Animate buildings
    buildings.forEach(function (building, itsIndex) {
        buildingBounds = building.getBounds();
        if ((building.x + buildingBounds.width) <= 0) {
            building.x = building.x = w + buildingBounds.width + (Math.random() * w);
            building.gotoAndStop(++building.currentFrame % building.numFrames);
        }
        building.x = building.x - fSpeed;
    });

    // Animate Ditch
    ditch.x = ((ditch.x + 200) < 0) ? w + (0.5 + Math.random()) * w : ditch.x - fSpeed;

    // Check if collsion has occured
    var pt = ditch.localToLocal(0, 0, ambulance);
    hitDitch(ambulance.hitTest(pt.x, pt.y));

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
        $(document).trigger("showhint");
    }
}

// Encountered Ditch
hitDitch = function (hit) {
    if(!hitFlags.ditch && hit) {
        hitFlags.ditch = true;
        ambulance.gotoAndPlay("hickup");
        $(document).trigger("hit-ditch");
    } else if (!hit && hitFlags.ditch) {
        hitFlags.ditch = false;
    }
}


function moveSprite(e) {
    // 39 - right arrow
    // 37 - left arrow
    if (e.keyCode === 39 || e.keyCode === 37 || e.keyCode === 32) {

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

        if (e.keyCode === 32) {
            $(document).trigger("play-pause")
        }

    }
}

$(window).on('keydown', moveSprite);

// Sound
// Mute Button
$("#mute-btn").on("click", function () {
    sound.volume = (sound.volume == 0) ? 0.1 : 0;
})

// Game events
$(document).on("hit-ditch", function () {
    $(document).trigger("play-pause");
    $(document).trigger('showquestion');
});

$(document).on("play-pause", function () {
    createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
    sound.volume = (sound.volume == 0) ? 0.1 : 0;
});

$(document).on("update-star", function () {
    star.ob.gotoAndStop(++star.ob.currentFrame % star.ob.numFrames);
});

var hintDislayed = false;
var nextQuestionIndex = 0;
var currectAnswers = 0;
var maxQuestions = 10;

$('.modal').modal({
  dismissible: false
});

var resetQuestion = function(elem) {
  $(elem).removeClass('invalid');
  $(elem).find('input').prop('checked', false).removeAttr('disabled');
}

$(document).on('showhint', function() {
  // Show hint only if its not displayed already
  if (!hintDislayed) {
    var text = $('.question').eq(nextQuestionIndex).find('.hint').text();
    // dont show hint if its not present
    if (text !== '') {
      Materialize.toast(text, 40000000);
      hintDislayed = true;
    }
  }
});

$(document).on('showquestion', function() {
  $('.question').addClass('hide');
  $('.question').eq(nextQuestionIndex).removeClass('hide');
  $('#questions-modal').modal('open').css({
    'display': 'block'
  });
});


// Event to close modal pop up.
$('#questionClose').on('click', function() {
  $('.toast').fadeOut(600, function() {
    $('.toast').remove();
  });

  if ($('.question').eq(nextQuestionIndex).hasClass('valid')) {
    setTimeout(function() {
      $(document).trigger("update-star");
      if (currectAnswers === maxQuestions) {
        $(document).trigger("play-pause");
        $(document).trigger("show-loader");
        localStorage.setItem('completedIn', createjs.Ticker.getTime(false));
        location.href = "/game-over";
      }
    }, 600);
    $('.question').eq(nextQuestionIndex).remove();
  } else {
    resetQuestion($('.question').eq(nextQuestionIndex));
    // If the current question is last question then set index to 0 and start the questions again
    if ($('.question').length === nextQuestionIndex) {
      nextQuestionIndex = 0;
    } else {
      nextQuestionIndex++;
    }
  }
  $('#questions-modal').modal('close');
  $('#questionClose').attr('disabled', true);
  hintDislayed = false;

  // trigger event to play on canvas
  $(document).trigger("play-pause");
});

// event to enable submit button only onclicking any input button.
$('.question input').on('click', function() {
  $('#questionSubmit').removeAttr('disabled');
});


// event on submit.
$('#questionSubmit').on('click', function() {

  var question = $('.question').eq(nextQuestionIndex);
  var value = $(question).find('input:checked').val();
  var id = $(question).attr('id');
  $('#questionSubmit').attr('disabled', true);
  $(question).find('input').attr('disabled', true);

  $.ajax({
    method: 'POST',
    url: '/check-answer/' + id,
    data: {
      answeredAs: value
    },
    success: function(resp) {
      if (resp.correctAns) {
        $(question).addClass('valid');
        currectAnswers++;
      } else {
        $(question).addClass('invalid');
      }
      $('#questionClose').removeAttr('disabled');
    },
    error: function(err) {
      console.info(err);
    }
  });
});
