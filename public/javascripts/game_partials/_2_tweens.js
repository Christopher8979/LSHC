function initTweens(params) {
    createjs.Tween.get(road, {
        loop: true
    }).to({
        x: -w
    }, speed * 45);

    createjs.Tween.get(clouds, {
        loop: true
    }).to({
        x: w
    }, speed * 5000);

    createjs.Tween.get(backBg, {
        loop: true
    }).to({
        x: -w
    }, speed * 500);

    createjs.Tween.get(frontBg, {
        loop: true
    }).to({
        x: -w
    }, speed * 80);
}