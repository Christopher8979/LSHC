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