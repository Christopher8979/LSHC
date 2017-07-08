var hintDislayed = false;
var nextQuestionIndex = 0;
var currectAnswers = 0;
var maxQuestions = 5;
var attemptedQuestions = 0;
var posTokenCount = 0;
var negTokenCount = 0;

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
        $(document).trigger("game-over", ['with-in-time']);
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
    url: '/check-answer/' + id,
    data: {
      answeredAs: value
    },
    cache: false,
    success: function(resp) {
      attemptedQuestions++;
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
    },
    error: function(err) {
      console.info(err);
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
  localStorage.setItem('completedIn', createjs.Ticker.getTime(true));
  localStorage.setItem('how', how);

  var attemptData = {
    Player__c: location.pathname.split('/').pop(),
    Correct_Answers__c: currectAnswers,
    Total_Questions_Attempted__c: attemptedQuestions,
    Negative_Tokens_Caught__c: posTokenCount,
    Positive_Tokens_Caught__c: negTokenCount,
    Time_Taken__c: createjs.Ticker.getTime(true),
    Token_Points__c: (posTokenCount - negTokenCount) * 10
  };

  $.ajax({
    url: '/saveAttempt',
    data: attemptData,
    method: 'POST',
    cache: false,
    success: function(resp) {
      location.href = "/game-over/" + location.pathname.split('/').pop();
    },
    error: function(err) {
      console.log(err);
    }
  });
});
