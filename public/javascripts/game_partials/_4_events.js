function moveSprite(e) {
    // 39 - right arrow
    // 37 - left arrow
    if (e.keyCode === 39 || e.keyCode === 37) {

        if (e.keyCode === 39) {
            var bounds = ambulance.getBounds();
            createjs.Tween.get(ambulance).to({
                x: ((ambulance.x + bounds.width) < w) ? ambulance.x + 10 : ambulance.x
            }, 30);
        }


        if (e.keyCode === 37) {
            var bounds = ambulance.getBounds();
            createjs.Tween.get(ambulance).to({
                x: (ambulance.x > 0) ? ambulance.x - 10 : ambulance.x
            }, 30);
        }

    }
}

$(window).on('keydown', moveSprite);