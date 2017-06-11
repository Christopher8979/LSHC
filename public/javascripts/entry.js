$(document).on('initialize-entry', function() {

  $('#enterGame').on('click', function(e) {
    var form = $('#credForm');
    var noOfFiels = $(form).find('input').length;
    var fieldsFilled = 0;

    $(form).find('input').each(function(index, elem) {
      if (!$(elem).hasClass('invalid') && $(elem).val() && $(elem).val() !== '') {
        fieldsFilled++;
      }
    });

    if (fieldsFilled === noOfFiels) {
      $(form).removeClass('fill-all');
      localStorage.setItem('player', $('#name').val());
      location.href = "/rules";
    } else {
      $(form).addClass('fill-all');
    }
  });

  $('#credForm input[type="text"]').bind('keydown', function(e) {
    console.log(e.keyCode);
    var elem = $(this);
    var KEYS_TO_OMIT = [32, 37, 39, 8, 9];

    if (KEYS_TO_OMIT.indexOf(e.keyCode) === -1) {
      if ((e.keyCode > 64 && e.keyCode < 91) || (e.keyCode > 96 && e.keyCode < 123)) {
        return true;
      } else {
        return false;
      }
    }
  });
});
