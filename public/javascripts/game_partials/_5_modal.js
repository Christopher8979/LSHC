var hintDislayed = false;
var nextQuestionIndex = 0;

$('.modal').modal({
  dismissible: false
});

$(document).on('showhint', function() {
  Materialize.toast('I am a toast!', 40000000);
});

$(document).on('showquestion', function() {
  $('.question').addClass('hide');
  $('.question').eq(nextQuestionIndex).removeClass('hide');
  $('#questions-modal').modal('open');
});

$('#questionClose').on('click', function() {
  nextQuestionIndex++;
  $('.toast').remove();
  $('#questions-modal').modal('close');
  $('#questionSubmit').removeAttr('disabled');
  $('#questionClose').attr('disabled', true);
});



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



$('#showHint').on('click', function() {
  $(document).trigger("showhint");
});


$('#showQuestion').on('click', function() {
  $(document).trigger("showquestion");
});
