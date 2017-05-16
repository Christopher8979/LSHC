$(document).on('initialize-entry', function() {

  $('#enterGame').on('click', function(e) {
    var form = $('#credForm');
    var noOfFiels = $(form).find('input').length;
    var fieldsFilled = 0;

    $(form).find('input').each(function(index, elem) {
      if ($(elem).val() && $(elem).val() !== '') {
        fieldsFilled++;
      }
    });

    if (fieldsFilled === noOfFiels) {
      $(form).removeClass('fill-all');
      localStorage.setItem('user', $('#name').val());
      location.href = "/play-game";
    } else {
      $(form).addClass('fill-all');
    }
  });
});
