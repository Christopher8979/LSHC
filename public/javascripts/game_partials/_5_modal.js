var hintDislayed = false;
var nextQuestionIndex = 0;
var currectAnswers = 0;
var maxQuestions = 10;

$('.modal').modal({
  dismissible: false
});

var resetQuestion = function(elem) {
  console.log('resetting this element', $(elem));
  $(elem).removeClass('invalid');
  $(elem).find('input').prop('checked', false).removeAttr('disabled');
}

$(document).on('showhint', function() {
  // Show hint only if its not displayed already
  if (!hintDislayed) {
    console.log('hint for ' + nextQuestionIndex + 'th index question is not shown. so showing');
    var text = $('.question').eq(nextQuestionIndex).find('.hint').text();
    // dont show hint if its not present
    if (text !== '') {
      console.log('text that will get showed in hint');
      console.log(text);
      Materialize.toast(text, 40000000);
      hintDislayed = true;
    } else {
      console.log('there is no hint for this question');
    }
  } else {
    console.log('hint already shown so proceeding');
  }
});


$(document).on('showquestion', function() {
  $('.question').addClass('hide');
  console.log('current question Index', nextQuestionIndex);
  console.log('element', $('.question').eq(nextQuestionIndex));
  $('.question').eq(nextQuestionIndex).removeClass('hide');
  $('#questions-modal').modal('open');
});


// Event to close modal pop up.
$('#questionClose').on('click', function() {
  $('.toast').fadeOut(600, function() {
    console.log('removing hint');
    $('.toast').remove();
  });

  if ($('.question').eq(nextQuestionIndex).hasClass('valid')) {
    console.log('correct answers count', currectAnswers);
    setTimeout(function() {
      $(document).trigger("update-star");

      if (currectAnswers === maxQuestions) {
        console.log('You have answered ' + maxQuestions + ' questions now!');
        $(document).trigger("play-pause");
        $(document).trigger("show-loader");
        console.log('redirecting to game over page');
        localStorage.setItem('completedIn', createjs.Ticker.getTime(false));
        location.href = "/game-over";
      }
    }, 600);
    $('.question').eq(nextQuestionIndex).remove();
    console.log('removing this question from holder');
    console.log('remaining questions', $('.question').length);
  } else {
    console.log('trigering reset question method for ' + nextQuestionIndex + ' th question');
    resetQuestion($('.question').eq(nextQuestionIndex));
    // If the current question is last question then set index to 0 and start the questions again
    console.log('checking if we are at last question in holders');
    console.log('checking ' + nextQuestionIndex + '(index) with' + ($('.question').length - 1) + '(length of remaining questions)');
    if ($('.question').length - 1 === nextQuestionIndex) {
      console.log('just showed last question hence making the index to 0.\n This will help in starting questions from starting again if ' + maxQuestions + ' questions are not answered');
      nextQuestionIndex = 0;
    } else {
      console.log('we are not yet at last index in the questions stack, incrementing index of question');
      nextQuestionIndex++;
    }
  }
  $('#questions-modal').modal('close');
  $('#questionClose').attr('disabled', true);
  hintDislayed = false;

  console.log('-----------------------------End of a iteration----------------------------------------');
  console.log('\n\n\n\n');

  // trigger event to play on canvas
  $(document).trigger("play-pause");
});

// event to enable submit button only onclicking any input button.
$('.question input').on('click', function() {
  console.lgo('enable submit button');
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
        console.log('quesiton answered correctly');
        console.log('incrementing correctly answered questions count');
        $(question).addClass('valid');
        currectAnswers++;
      } else {
        console.log('question was not answered correctly');
        $(question).addClass('invalid');
      }
      $('#questionClose').removeAttr('disabled');
    },
    error: function(err) {
      console.info(err);
    }
  });
});
