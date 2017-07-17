// Drop Tokens
dropTokens = function(flag) {
  var tokens = (flag) ? ptokens : ntokens;
  var tokenIndex = Math.floor(Math.random() * tokens.length - 1) + 1;
  var token = tokens[tokenIndex];

  // Check for animation
  if (token.isAnimating) {
    return;
  }
  token.isAnimating = true;
  token.notCollectd = true;

  token.x = Math.floor(Math.random() * w) + 1;
  token.y = -200;
  stage.addChild(token);
  createjs.Tween.get(token).to({
    y: w
  }, speed * 45).call(function() {
    token.isAnimating = false
    stage.removeChild(token)
  })
}

// Token Collection Handler
tokenCollected = function(token, flag) {
  stage.removeChild(token);
  if (token.notCollectd) {
    token.notCollectd = false;
    score.value = (flag) ? score.value + 10 : score.value - 10;
    score.ob.text = "SCORE:" + (score.value);

    // Set default sound to quarter the main volume of the game
    var soundVol = sound.volume * effectVolRatio;

    if (flag) {
      // increment token till we have 3 positinve things collected
      if (tokensCaught < 3) {
        tokensCaught++;
        $(document).trigger('hint-indicator-change', [tokensCaught - 1]);
      }
      // Fire show hint once 3 tokens are collected
      if (tokensCaught === 3) {
        // tokensCaught = 0;
        $(document).trigger("showhint");
      }

      // Play positive sound
      createjs.Sound.play("plusSound", {
        volume: soundVol
      });

      ambulance.gotoAndPlay("plus");

      $(document).trigger('token-caught', [true]);

    } else {
      // Uncomment below line to decrease number of tokens taken
      // When negetive token is taken

      // tokensCaught--;

      // Play negative sound
      createjs.Sound.play("minusSound", {
        volume: soundVol
      });
      ambulance.gotoAndPlay("minus");

      $(document).trigger('token-caught', [false]);
    }
  }
}

// Encountered Ditch
hitDitch = function(hit) {
  if (!hitFlags.ditch && hit) {
    hitFlags.ditch = true;
    ambulance.gotoAndPlay("hickup");
    $(document).trigger("hit-ditch");
  }
}

function updateTime(t) {
  time.text = new Date(t).toISOString().substr(11, 8);
}


function moveSprite(e) {
  if (location.pathname.search('/play-game') !== -1) {
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
        if (!$('#questions-modal').hasClass('open') && type == "keydown") {
          $(document).trigger("play-pause")
        }
      }

    }
  }
}

$(window).on('keydown', moveSprite);
$(window).on('keyup', moveSprite);

// Sound
// Mute Button
$("#mute-btn").on("click", function() {
  if (!createjs.Ticker.getPaused()) {
    $(this).toggleClass("btn-clicked");
  }
  $(document).trigger("toggle-mute");
})

// Play Button
$("#start-btn").on("click", function() {
  $(document).trigger("play-pause");
})

// Game events
$(document).on("hit-ditch", function() {
  $(document).trigger("play-pause");
  $(document).trigger('showquestion');
});

$(document).on("play-pause", function() {
  createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
  $("#start-btn").toggle();
  $(document).trigger("toggle-mute");
});

$(document).on("update-star", function() {
  star.ob.gotoAndStop(++star.ob.currentFrame % star.ob.numFrames);
});

$(document).on("toggle-mute", function() {
  var $mute = $("#mute-btn");
  if (sound.volume == 0 && !$mute.hasClass("btn-clicked") && !createjs.Ticker.getPaused()) {
    $mute.removeClass("active");
    sound.volume = playVol;
  } else {
    $("#mute-btn").addClass("active");
    sound.volume = 0;
  }
})

$(document).on("plusSound", function() {
  // Play positive sound
  createjs.Sound.play("plusSound", {
    volume: (playVol * effectVolRatio)
  });
})

$(document).on("minusSound", function() {
  // Play negative sound
  createjs.Sound.play("minusSound", {
    volume: (playVol * effectVolRatio)
  });
})
