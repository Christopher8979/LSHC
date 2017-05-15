var hintDislayed = false;
var nextQuestionIndex = 0;

$('.modal').modal({
  dismissible: false
});

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
});


// Event to close modal pop up.
$('#questionClose').on('click', function() {
  $('.toast').fadeOut(600, function() {
    $('.toast').remove();
  });

  if ($('.question').eq(nextQuestionIndex).hasClass('valid')) {
    setTimeout(function() {
      // trigger method to increment star
      $(document).trigger("update-star");
      $(document).trigger("update-star");

    }, 600);
  }
  $('#questions-modal').modal('close');
  $('#questionSubmit').removeAttr('disabled');
  $('#questionClose').attr('disabled', true);
  nextQuestionIndex++;
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
      $(question).addClass('valid');
      $('#questionClose').removeAttr('disabled');
    },
    error: function(err) {
      $(question).addClass('invalid');
      $('#questionClose').removeAttr('disabled');
    }
  });
});
