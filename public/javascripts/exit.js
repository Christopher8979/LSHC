$(document).on('initialize-exit', function() {
  var correctAnswers = parseInt($("#correct-answers-value").text());
  if (correctAnswers == 5) {
    $(".trophy-image").removeClass("not-complete");
  }
});
