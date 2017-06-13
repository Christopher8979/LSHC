$(document).on('initialize-rules', function() {
  $('.ackwldge input').on('change', function() {
    $('#play').attr('disabled', !$(this).is(':checked'));
  });
});
