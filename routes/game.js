var express = require('express');
var router = express.Router();
var GameService = require('../services/gameService.js');
var md5 = require('../services/md5');

/* GET home page. */
router.get('/', function(req, res) {
  GameService.getWinner(function(err, winnerInfo) {
    if (err) {
      console.log(err);
      return res.render('500', 'Something went wrong in the backend');
    }

    var topScorrer = {
      name: "-",
      score: "-"
    };

    if (winnerInfo) {
      topScorrer = {
        name: winnerInfo.Player__r.Name,
        email: winnerInfo.Player__r.Email__c,
        score: winnerInfo.Final_Score__c
      };
    }

    GameService.getMetadata(function(err, metadata) {
      if (err) {
        console.log(err);
        return res.render('500', 'Something went wrong in the backend');
      }

      var fields = metadata.fields;
      var serviceLineOptions = [];
      fields.forEach(function(value) {
        if (value.name === 'Service_Line__c') {
          value.picklistValues.forEach(function(options) {
            serviceLineOptions.push({
              label: options.label,
              value: options.value
            });
          });
        }
      });

      res.render('entry', {
        description: 'Health Trek',
        caption: 'Rescue on the way',
        topScorrer: topScorrer,
        serviceLineOptions: serviceLineOptions
      });
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
      return res.status(500).jsonp({
        status: 'error while creating user record.',
        error: err
      });
    }

    res.status(200).jsonp({
      id: data
    });
  });

});

router.get('/rules/:id', function(req, res) {
  if (!(req.params && req.params.id)) {
    return res.render('400', 'No params in rules page');
  }

  var NO_OF_ATTEMPTS = 2;
  GameService.lastAttempts(req.params.id, NO_OF_ATTEMPTS, function(err, data) {
    if (err) {
      console.info('Error while getting attempts');
      return res.render('/');
    }

    for (var i = 0; i < NO_OF_ATTEMPTS; i++) {
      if (!data[i]) {
        data[i] = {};
      }
    }

    res.render('rules', {
      attempts: data,
      playerID: req.params.id
    });
  });
});

router.get('/play-game/:id', function(req, res) {
  if (!(req.params && req.params.id)) {
    return res.render('400', 'No params in rules page');
  }

  GameService.getQuestions(function(questions) {
    GameService.createAttempt({
      Player__c: req.params.id
    }, function(err, resp) {
      if (err) {
        console.log(err);
        return res.render('500', 'Something went wrong in the backend');
      }
      res.render('play-game', {
        title: 'Playing game now',
        questions: questions,
        attemptID: resp.id
      });
    });
  });
});

router.post('/check-answer/:attempt/:id', function(req, res) {
  var tokenScore = (req.body.Positive_Tokens_Caught__c - req.body.Negative_Tokens_Caught__c) * 10
  var hash = md5(tokenScore + Math.floor(new Date().getUTCMinutes()/5));
  console.log(Math.floor(new Date().getUTCMinutes()/5));

  if (!(req.params && req.params.attempt && req.params.id && hash == req.body.Sign__c)) {
    // TODO: this is an AJAX call, i dont think you can render a page here
    return res.render('400', 'Proper params are not provided');
  }

  var questionNo = req.params.id;
  var answeredAs = req.body.answeredAs;
  var attemptID = req.params.attempt;

  GameService.checkAnswer(questionNo, answeredAs, function(err, response) {
    if (err) {
      console.info('Error wihile checking answers');
      console.log(err);
      return res.status(400).jsonp({
        'status': 'something went wrong',
        'err': err
      });
    }

    GameService.updateAttempt(attemptID, response.answeredCorrect, req.body, function(err, stopGame) {

      if (err) {
        console.info('Error wihile checking answers');
        console.log(err);
        return res.status(400).jsonp({
          'status': 'something went wrong',
          'err': err
        });
      }
      // if stopGame === true game has to end
      response.endGame = stopGame;
      res.status(200).jsonp(response);
    });

  });
});

router.get('/game-over/:id', function(req, res) {

  if (!(req.params && req.params.id)) {
    return res.render('400', 'No params in rules page');
  }

  var NO_OF_ATTEMPTS = 1;
  GameService.lastAttempts(req.params.id, NO_OF_ATTEMPTS, function(err, attemptData) {
    if (err) {
      console.info('Error while getting last attempt');
      return res.render('/');
    }
    GameService.getPlayerDetails(attemptData[0].Player__c, function(err, playerInfo) {
      if (err) {
        console.info('Error while getting player details');
        return res.render('/');
      }
      GameService.getWinner(function(err, winnerInfo) {
        if (err) {
          console.info('Error while getting winner');
          return res.render('/');
        }
        var topScorrer = {
          name: winnerInfo.Player__r.Name,
          email: winnerInfo.Player__r.Email__c,
          score: winnerInfo.Final_Score__c
        };

        res.render('game-over', {
          lastAttempts: attemptData[0],
          topScorrer: topScorrer,
          player: playerInfo[0]
        });
      });
    });

  });
});

router.post('/saveAttempt/:id', function(req, res) {
  var tokenScore = (req.body.Positive_Tokens_Caught__c - req.body.Negative_Tokens_Caught__c) * 10
  var hash = md5(tokenScore + Math.floor(new Date().getUTCMinutes()/5));

  if (!(req.params && req.params.id && hash == req.body.Sign__c)) {
    return res.status(400).jsonp({
      'status': 'didnt recieve attempt id to modify'
    });
  }

  if (!req.body) {
    return res.status(400).jsonp({
      'status': 'Player details not sent in ajax call'
    });
  }

  GameService.saveAttempt(req.params.id, req.body, function(err, resp) {
    if (err) {
      console.info('Error wihile saving this attempt');
      console.log(err);
      return res.status(500).jsonp({
        'status': 'something went wrong',
        'err': err
      });
    }

    res.status(200).jsonp({
      'status': 'saved attempt successfully'
    });
  });
});

router.get('/contributors', function(req, res) {
  res.render('contributors', require('../data/contributor-list.json'));
});

router.get('/*', function(req, res) {
  res.redirect('/');
});

module.exports = router;
