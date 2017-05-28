var express = require('express');
var router = express.Router();
var GameService = require('../services/gameService.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('entry', {
    title: 'It\'s LHSC Game Time',
    description: 'Play and Test your LSHC knowledge the Fun way.'
  });
});

router.get('/rules', function (req, res) {
  res.render('rules');
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

  GameService.checkAnswer(questionNo, answeredAs, function(err, response) {
    if (err) {
      return res.status(400).jsonp({
        'status': 'something went wrong',
        'err': err
      });
    }

    res.status(200).jsonp({
      'correctAns': response
    });
  });
});

router.get('/game-over', function(req, res) {
  res.render('game-over', {
    title: 'Game is up'
  });
});

router.get('/*', function(req, res) {
  res.redirect('/');
});

module.exports = router;
