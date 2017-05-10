$(document).on('initialize-game', function() {
  var stage = new createjs.Stage('game-holder');

  /**
   * Create background
   *  - sky
   *  - sun
   *  - clouds (at its own pace)
   *  - buildings backgrounds(3 layers at their own pace)
   *  - create building scquence randomly on load and have it as a background
   *  - road
   *  - diches(each ditch should have a configuration for pop up)
   *  - sprite for ambulance.
   *  - have all the above movements driven with variables that will later be adjusted with key press
   *  - configure items falling from the screen.(sprites)
   *  - key press should increase or decrease a speed variable that will controll complete canvas(this shouldnot efect speed of the items falling)
   */
  console.log(stage);
});
