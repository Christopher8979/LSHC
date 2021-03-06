var hintDislayed = false;
var nextQuestionIndex = 0;
var currectAnswers = 0;
var maxQuestions = 5;
var attemptedQuestions = 0;
var posTokenCount = 0;
var negTokenCount = 0;
var gameOver = false;

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
  $(document).trigger('hint-indicator-change', ['RESET']);

  if ($('.question').eq(nextQuestionIndex).hasClass('valid')) {
    setTimeout(function() {
      $(document).trigger("update-star");
      $(document).trigger("update-star");
      if (currectAnswers === maxQuestions) {
        $(document).trigger("play-pause");
        $(document).trigger("show-loader");
        if (gameOver) {
          location.href = "/game-over/" + location.pathname.split('/').pop();
        }
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

  var referenceHolder = ['a', 'b', 'c', 'd'];
  $.ajax({
    method: 'POST',
    url: '/check-answer/' + $('#mute-btn').data('id') + '/' + id,
    data: {
      answeredAs: value,
      Negative_Tokens_Caught__c: negTokenCount,
      Positive_Tokens_Caught__c: posTokenCount,
      Time_Taken__c: parseInt((createjs.Ticker.getTime(true) / 1000).toFixed(0), 10),
      Sign__c: hash
    },
    cache: false,
    success: function(resp) {
      attemptedQuestions++;
      negTokenCount = 0;
      posTokenCount = 0;
      if (resp.answeredCorrect) {
        $(question).addClass('valid');
        currectAnswers++;
        $(document).trigger('plusSound');
      } else {
        $(question).addClass('invalid');
        $(document).trigger('minusSound');
        $(question).find('p').eq(referenceHolder.indexOf(resp.correctOption)).addClass('correct-answer');
      }
      $('#questionClose').removeAttr('disabled');
      if (resp.endGame) {
        gameOver = true;
      }
    },
    error: function(err) {
      Materialize.toast("Your Session has timedout. You will be redirected now", 5000, '', function () {
        window.location = "/";
      });
    }
  });
});

$(document).on('token-caught', function(event, isPositiveToken) {
  if (isPositiveToken) {
    posTokenCount++;
  } else {
    negTokenCount++;
  }
});

$(document).on('hint-indicator-change', function(event, count) {
  var msgs = $('.hit-progress .messages');
  var progressBars = $('.hit-progress .progress-show .determinate');
  if (count === 'RESET') {
    $(msgs).removeAttr('style');
    $(progressBars).removeAttr('style');
  } else {
    $(msgs).css('margin-top', '-' + (20 * (count + 1)) + 'px');
    $(progressBars).eq(count).css('width', '99.99%');
  }
});

$(document).on('game-over', function(event, how) {
  // TODO: Dont we need a time taken here too?
  if (how === 'time-out') {
    $.ajax({
      url: '/saveAttempt/' + $('#mute-btn').data('id'),
      method: 'POST',
      cache: false,
      data: {
        Negative_Tokens_Caught__c: negTokenCount,
        Positive_Tokens_Caught__c: posTokenCount,
        Sign__c: hash
      },
      success: function(resp) {
        location.href = "/game-over/" + location.pathname.split('/').pop();
      },
      error: function(err) {
        Materialize.toast("Your Session has timedout. You will be redirected now", 5000, '', function () {
          window.location = "/";
        });
      }
    });
  }

});
