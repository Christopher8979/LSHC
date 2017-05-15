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
        $(document).trigger("token-collected");
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
    console.log("HIT THE DITCH");
    $(document).trigger("play-pause");
});

$(document).on("play-pause", function () {
    createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
    sound.volume = (sound.volume == 0) ? 0.1 : 0;
});

$(document).on("update-star", function () {
    star.ob.gotoAndStop(++star.ob.currentFrame % star.ob.numFrames);
})


/**
 * Emmitted events
 * 
 * 1. hit-ditch
 * 2. token-collected
 */