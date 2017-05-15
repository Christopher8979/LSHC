var express = require('express');
var router = express.Router();
var GameService = require('../services/gameService.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('entry', {
    title: 'Initializing game'
  });
});

router.get('/play-game', function(req, res) {
  GameService.getQuestions(function(questions) {
    res.render('play-game', {
      title: 'Playing game now',
      questions: questions
    });
  });
});

router.post('/check-answer/:id', function(req, res) {
  var questionNo = req.params.id;
  var answeredAs = req.body.answeredAs;

  GameService.checkAnswer(questionNo, answeredAs, function (err, response) {
    if (err) {
      return res.status(400).jsonp({
        'answeredTrue': false;
      });
    }

    res.status(200).jsonp({
      'answeredTrue': true;
    });
  });
});

router.get('/game-over', function(req, res) {
  res.render('game-over', {
    title: 'Game is up'
  });
});


module.exports = router;
