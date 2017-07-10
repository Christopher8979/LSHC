$(document).on('initialize-entry', function() {

  $('select').material_select();

  $('#enterGame').on('click', function(e) {
    
    var $form = $('#credForm');
    var validForm = validateEntryForm($form);

    if (validForm) {

      // clear errors and setup the game
      $form.removeClass('fill-all');
      localStorage.setItem('player', $('#name').val());

      // Populate data to be verified in salesforce
      var data = {};

      // For inputs
      $('#credForm input.validate, #credForm select').each(function(index, ele) {
        data[$(ele).data('params')] = $(ele).val();
      });

      console.log(data);

      $.ajax({
        url: '/checkUser',
        data: data,
        method: 'POST',
        cache: false,
        success: function(data) {
          location.href = "/rules/" + data.id;
        },
        error: function(err) {
          Materialize.toast('<span>Unable to log in. Please try again later</span>', 5000, '', function() {
            location.href = '/';
            console.log(err);
          });
        }
      });
    } else {
      $form.addClass('fill-all');
    }
  });

  // Realtime validation email field
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


function validateEntryForm($form) {
  
  // var noOfFiels = $(form).find('.input-field').length;
  
  // Initialize Valid to false
  var valid = true;

  // Check if inputs are empty or invalid
  $form.find("input").each(function () {
    var $input = $(this);

    if ($input.hasClass('invalid') || $input.val() == '') {
      valid = false;
    }
  })

  // Check if drop boxes are null
  $form.find("select").each(function () {
    var $select = $(this);

    if ($select.val() == null) {
      valid = false;
    }
  })

  return valid
}