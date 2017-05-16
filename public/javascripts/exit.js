$(document).on('initialize-exit', function() {
  var name = localStorage.getItem('player');
  var time = localStorage.getItem('completedIn');

  if (name === null || time === null) {
    location.href = '/';
  } else {
    time = time / 1000;
    var minutes = parseInt((time / 60), 10);
    var seconds = time % 60;

    $('.name').text(name);
    $('.min').text(minutes);
    $('.sec').text(seconds);
  }
});
