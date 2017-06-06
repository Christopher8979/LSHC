var stage, w, h, loader;
var sky, sun, clouds, road, buildings, backBg, frontBg, ambulance, speed = 100, time,
  hitFlags = {},
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
// }, {
//   src: "hospital-sprite.png",
//   id: "hospital"
// }, {
//   src: "clinic-sprite.png",
//   id: "clinic"
// }, {
//   src: "store-sprite.png",
//   id: "store"
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
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.on("fileload", function () {
        sound = createjs.Sound.play("music", { interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0});
    }, this);
    createjs.Sound.registerSound("../audio/bg-music.mp3", "music");

    // Manifest Loading complete handler
    function handleComplete(e) {

        // Removing loading symbol
        $('.preloader').removeClass('loading');

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
        // var refObj = [
        //     { id: "hospital", width: 300, height: 146 },
        //     { id: "clinic", width: 127, height: 96 },
        //     { id: "store", width: 148, height: 73 }
        // ];
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
        score.ob = new createjs.Text("SCORE:" + score.value, "30px monospace", "#00000");
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
    if (!paused) {
      // setting initial vloume
      sound.volume = (sound.volume == 0) ? 0.1 : 0;
      $(document).trigger("play-pause");
      paused = true;
    }
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
        building.x = ((building.x + buildingBounds.width) <= 0) ? w + buildingBounds.width + (Math.random() * w) : building.x - fSpeed;
    });

    // Animate Ditch
    if((ditch.x + 200) < 0) {
        ditch.x = w + (0.5 + Math.random()) * w;
        hitFlags.ditch = false;
    } else {
        ditch.x =  ditch.x - fSpeed;
    }

    // Check if collsion has occured
    var pt = ditch.localToLocal(0, 0, ambulance);
    hitDitch(ambulance.hitTest(pt.x, pt.y));

    // Randomly drop tokens
    if (Math.random() > 0.95) {
        var flag = (Math.random() < 0.6) ? true : false;
        dropTokens(flag);
    }

    // Check if token collected
    ptokens.forEach(function (token) {
        var pt = token.localToLocal(20, 0, ambulance);
        if (ambulance.hitTest(pt.x, pt.y)) {
            tokenCollected(token, true);
        }
    }, this);
    ntokens.forEach(function (token) {
        var pt = token.localToLocal(20, 0, ambulance);
        if (ambulance.hitTest(pt.x, pt.y)) {
            tokenCollected(token, false);
        }
    }, this);

    // Move ambulance
    if (ambulance.move == "right") {
        var bounds = ambulance.getBounds();
        ambulance.x = ((ambulance.x + bounds.width) < w) ? ambulance.x + 7 : ambulance.x;
    } else if (ambulance.move == "left") {
        ambulance.x = (ambulance.x > 0) ? ambulance.x - 5 : ambulance.x
    }

    // Update Time
    updateTime(event.runTime)

    // Update stage
    stage.update(event);
}

// Drop Tokens
dropTokens = function (flag) {
    var tokens = (flag) ? ptokens : ntokens;
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
tokenCollected = function (token, flag) {
    stage.removeChild(token);
    if (token.notCollectd) {
        token.notCollectd = false;
        score.value = (flag) ? score.value + 10 : score.value - 10;
        score.ob.text = "SCORE:" + (score.value);
        if (flag) {
            // increment token till we have 3 positinve things collected
            if (tokensCaught<3) {
                tokensCaught++;
            }
            // Fire show hint once 3 tokens are collected
            if (tokensCaught === 3) {
                // tokensCaught = 0;
                $(document).trigger("showhint");
            }
        } else {
            // Uncomment below line to decrease number of tokens taken 
            // When negetive token is taken
            
            // tokensCaught--;
        }
    }
}

// Encountered Ditch
hitDitch = function (hit) {
    if(!hitFlags.ditch && hit) {
        hitFlags.ditch = true;
        ambulance.gotoAndPlay("hickup");
        $(document).trigger("hit-ditch");
    } 
}

function updateTime(t) {
    time.text = new Date(t).toISOString().substr(11, 8);
}


function moveSprite(e) {
    // console.log(e);
    var type = e.type;
    // 39 - right arrow
    // 37 - left arrow
    if (e.keyCode === 39 || e.keyCode === 37 || e.keyCode === 32) {

        if (e.keyCode === 39) {
            ambulance.move = (type == "keydown") ? "right" : null;
        }


        if (e.keyCode === 37) {
            ambulance.move = (type == "keydown") ? "left" : null;
        }

        if (e.keyCode === 32) {
            if(!$('#questions-modal').hasClass('open') && type == "keydown") {
              $(document).trigger("play-pause")
            }
        }

    }
}

$(window).on('keydown', moveSprite);
$(window).on('keyup', moveSprite);

// Sound
// Mute Button
$("#mute-btn").on("click", function () {
    if (!createjs.Ticker.getPaused()) {
        $(this).toggleClass("btn-clicked");
    }
    $(document).trigger("toggle-mute");
})

// Play Button
$("#start-btn").on("click", function () {
    $(document).trigger("play-pause");
})

// Game events
$(document).on("hit-ditch", function () {
    $(document).trigger("play-pause");
    $(document).trigger('showquestion');
});

$(document).on("play-pause", function () {
    createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
    $("#start-btn").toggle();
    $(document).trigger("toggle-mute");
});

$(document).on("update-star", function () {
    star.ob.gotoAndStop(++star.ob.currentFrame % star.ob.numFrames);
});

$(document).on("toggle-mute", function () {
    var $mute =  $("#mute-btn");
    if (sound.volume == 0 && !$mute.hasClass("btn-clicked") && !createjs.Ticker.getPaused()) {
       $mute.removeClass("active");
        sound.volume = 0.1;
    } else {
        $("#mute-btn").addClass("active");
        sound.volume = 0;
    }
})

var hintDislayed = false;
var nextQuestionIndex = 0;
var currectAnswers = 0;
var maxQuestions = 5;

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
      text = '<b class="green-text">Hint: </b>' + text;
      Materialize.toast(text, 40000000);
      hintDislayed = true;
    }
  }
});

$(document).on('showquestion', function() {
  $('.question').addClass('hide');
  $('.question').eq(nextQuestionIndex).removeClass('hide');
  $('#questions-modal').modal('open');
  $('#questions-modal').css({
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
  tokensCaught = 0;
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
