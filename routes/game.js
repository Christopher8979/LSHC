var express = require('express');
var router = express.Router();
var GameService = require('../services/gameService.js');

/* GET home page. */
router.get('/', function(req, res) {
  GameService.getWinner(function(err, data) {
    var topScorrer = {};

    res.render('entry', {
      title: 'It\'s LSHC Game Time',
      description: 'Play and test your LSHC knowledge the fun way!',
      topScorrer: topScorrer
    });
  });
});


router.post('/checkUser', function(req, res) {
  if (!req.body) {
    return res.status(400).jsonp({
      'status': 'Player details not sent in ajax call'
    });
  }

  GameService.createPlayer(req.body, function(err, data) {

    if (err) {
      return res.status(400).jsonp({
        status: 'error while creating user record.',
        error: err
      });
    }

    res.status(200).jsonp({
      id: req.body ? req.body.Email__c : ''
    });
  });

});

router.get('/rules/:id', function(req, res) {
  if (!(req.params && req.params.id)) {
    return res.render('500', 'No params in rules page');
  }

  var NO_OF_ATTEMPTS = 2;
  GameService.lastAttempts(req.params.id, NO_OF_ATTEMPTS, function(err, data) {
    var lastAttempts = data.records;
    res.render('rules', lastAttempts);
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

router.get('/game-over/:id', function(req, res) {

  if (req.params && req.params.id) {
    return res.render('500', 'No params in rules page');
  }

  var NO_OF_ATTEMPTS = 1;
  GameService.lastAttempts(req.params.id, NO_OF_ATTEMPTS, function(err, data) {
    var lastAttempts = {};

    GameService.getWinner(function(err, data) {
      var topScorrer = {};

      res.render('game-over', {
        lastAttempts: lastAttempts,
        topScorrer: topScorrer
      });
    });

  });
});

router.get('/*', function(req, res) {
  res.redirect('/');
});

module.exports = router;
