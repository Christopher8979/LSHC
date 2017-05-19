function tickHandler(event) {
    if (!paused) {
      // setting initial vloume
      sound.volume = (sound.volume == 0) ? 0.1 : 0;
      $(document).trigger("play-pause");
      paused = true;
    }
    var deltaS = event.delta;
    var maxSpeed = 1000;
    var fSpeed = deltaS / 5; // foreground speed

    if (event.paused) {return;}

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
    if((ditch.x + 200) < 0) {
        ditch.x = w + (0.5 + Math.random()) * w;
        hitFlags.ditch = false;
    } else {
        ditch.x =  ditch.x - fSpeed;
    }

    // Check if collsion has occured
    var pt = ditch.localToLocal(0, 0, ambulance);
    hitDitch(ambulance.hitTest(pt.x, pt.y));

    // Randomly drop tokens
    if (Math.random() > 0.99) {
        var flag = (Math.random() < 0.6) ? true : false;
        dropTokens(flag);
    }

    // Check if token collected
    ptokens.forEach(function (token) {
        var pt = token.localToLocal(20, 0, ambulance);
        if (ambulance.hitTest(pt.x, pt.y)) {
            tokenCollected(token, true);
        }
    }, this);
    ntokens.forEach(function (token) {
        var pt = token.localToLocal(20, 0, ambulance);
        if (ambulance.hitTest(pt.x, pt.y)) {
            tokenCollected(token, false);
        }
    }, this);

    // Update stage
    stage.update(event);
}
