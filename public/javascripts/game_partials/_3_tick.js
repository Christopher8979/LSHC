function tickHandler(event) {
    var deltaS = event.delta;
    var maxSpeed = 1000;
    var fSpeed = deltaS / 5; // foreground speed

    // Animate trees
    treeStrip.forEach(function (tree, treeIndex) {
        treeBounds = tree.getBounds();
        tree.x = ((tree.x + treeBounds.width) <= 0) ? tree.x = w + treeBounds.width + (Math.random() * w) : tree.x - fSpeed;
    });

    // Animate buildings
    buildings.forEach(function (building, itsIndex) {
        buildingBounds = building.getBounds();
        if ((building.x + buildingBounds.width) <= 0) {
            building.x = building.x = w + buildingBounds.width + (Math.random() * w);
            building.gotoAndStop(++building.currentFrame % building.numFrames);
        }
        building.x = building.x - fSpeed;
    });

    // Animate Ditch
    ditch.x = ((ditch.x + 200) < 0) ? w + (0.5 + Math.random()) * w : ditch.x - fSpeed;

    // Check if collsion has occured
    var pt = ditch.localToLocal(0, 0, ambulance);
    if (ambulance.hitTest(pt.x, pt.y)) {
        ambulance.gotoAndPlay("hickup");
        hitDitch(ditch);
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

    // Update stage
    stage.update(event);
}