$(document).on('initialize-rules', function() {

  /**
   * openInNewTab - utility method to open an url in next tab
   * @param  {String} url - URL to be opened
   */
  function openInNewTab(url) {
    var a = document.createElement("a");
    a.href = url;
    a.click();
  }

  $('#play').attr('href', $('#play').attr('href') + '/' + location.pathname.split('/').pop());


  // In case attr doesnt work
  // 
  // $('#play').on('click', function() {
  //   openInNewTab('/play-game' + '/' + location.pathname.split('/').pop());
  // });

  $('.ackwldge input').on('change', function() {
    $('#play').attr('disabled', !$(this).is(':checked'));
  });

});
