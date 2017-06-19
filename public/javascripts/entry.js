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

  $('#credForm input[type="email"]').bind('blur', function(e) {
    var value = $(this).val().trim();
    var isInvalid = true;
    if (value) {
      if (value && value.split('@').length === 2) {
        if (value.split('@')[1].split('.').length >= 2 && value.split('@')[1].split('.')[0].length > 0 && value.split('@')[1].split('.')[1].length > 0) {
          isInvalid = false;
        }
      }

      if (isInvalid && value !== '') {
        $(this).addClass('invalid');
      } else {
        $(this).addClass('valid');
      }
    } else {
      $(this).removeClass('invalid');
    }
  });

  $('#credForm input[type="text"]').bind('keydown', function(e) {
    var elem = $(this);
    var KEYS_TO_OMIT = [32, 37, 39, 8, 9];

    if (KEYS_TO_OMIT.indexOf(e.keyCode) === -1) {
      if ((e.keyCode > 64 && e.keyCode < 91) || (e.keyCode > 96 && e.keyCode < 123)) {
        return true;
      } else {
        return false;
      }
    }
  }).bind('blur', function(e) {

    if (!$(this).val().trim()) {
      $(this).val('');
      $(this).removeClass('invalid');
    }

  });
});
