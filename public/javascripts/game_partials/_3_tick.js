function tickHandler(event) {
    var deltaS = event.delta;
    var maxSpeed = 1000;
    var fSpeed = deltaS / 5;

    treeStrip.forEach(function (tree, treeIndex) {
        treeBounds = tree.getBounds();
        tree.x = ((tree.x + treeBounds.width) <= 0) ? tree.x = w + treeBounds.width + (Math.random() * w) : tree.x - fSpeed;
    });


    buildings.forEach(function (building, itsIndex) {
        buildingBounds = building.getBounds();
        building.x = ((building.x + buildingBounds.width) <= 0) ? building.x = w + buildingBounds.width + (Math.random() * w) : building.x - fSpeed;
    });

    ditch.x = ((ditch.x + 200) < 0) ? w + (0.5 + Math.random()) * w : ditch.x - fSpeed;

    // Check if collsion has occured
    var pt = ditch.localToLocal(0, 0, ambulance);
    if (ambulance.hitTest(pt.x, pt.y)) {
        ambulance.gotoAndPlay("hickup");
    }

    // Randomly drop tokens
    if (Math.random() * 1000 > 980) {
        dropTokens();
    }

    // Check if token collected
    tokens.forEach(function (token) {
        var pt = token.localToLocal(20, 0, ambulance);
        if (ambulance.hitTest(pt.x, pt.y)) {
            tokenCollected(token);
        }
    }, this);

    stage.update(event);
}