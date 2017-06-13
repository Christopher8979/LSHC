$(document).on('initialize-exit', function() {
  var name = localStorage.getItem('player');
  var time = localStorage.getItem('completedIn');
  var how = localStorage.getItem('how');

  if (name === null || time === null || how === null) {
    location.href = '/';
  } else {
    time = time / 1000;
    var minutes = parseInt((time / 60), 10);
    var seconds = time % 60;

    $('.name').text(name);

    if (how === 'with-in-time') {
      $('#restart').remove();
      $('#quit').addClass('offset-s3');
      $('.kicked').remove();
      localStorage.removeItem('player');
    } else if (how === 'time-out') {
      $('.answered').remove();
      seconds = 0;
    }

    $('.min').text(minutes);
    $('.sec').text((seconds).toFixed(2));


    localStorage.removeItem('how');
    localStorage.removeItem('completedIn');
  }
});
