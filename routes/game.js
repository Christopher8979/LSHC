var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('entry', {
    title: 'Initializing game'
  });
});

router.get('/play-game', function(req, res, next) {
  res.render('play-game', {
    title: 'Playing game now'
  });
});

router.get('/game-over', function(req, res, next) {
  res.render('game-over', {
    title: 'Game is up'
  });
});


module.exports = router;
