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
