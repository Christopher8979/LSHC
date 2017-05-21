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
        score.ob.text = "SCORE: " + (score.value);
        if (flag) {
            $(document).trigger("showhint");
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
            if(!$('#questions-modal').hasClass('open')) {
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
    sound.volume = (sound.volume == 0) ? 0.1 : 0;
})

// Play Button
$("#start-btn").on("click", function () {
    console.log("here");
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
    sound.volume = (sound.volume == 0) ? 0.1 : 0;
});

$(document).on("update-star", function () {
    star.ob.gotoAndStop(++star.ob.currentFrame % star.ob.numFrames);
});
