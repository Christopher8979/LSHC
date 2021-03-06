var QUESTIONS = require('../data/questions.json').questions;
var _ = require('lodash');
var FS = require('./ForceService.js');
var ASYNC = require('async');
var md5 = require('./md5');


var randomizeQuestions = function(questions, callBack) {
  var indexArray = [];
  var randomizedIndex = [];
  var randomizedQuestions = [];
  var someIndex = 0;

  questions.forEach(function(value, index) {
    indexArray.push(index);
  });

  for (var i = 0; randomizedIndex.length < indexArray.length; i++) {
    someIndex = Math.floor(Math.random() * (indexArray.length));
    if (randomizedIndex.indexOf(someIndex) === -1) {
      randomizedIndex.push(someIndex);
    }
  }

  randomizedIndex.forEach(function(indexValue) {
    randomizedQuestions.push(questions[indexValue]);
  });

  callBack(randomizedQuestions);
};

var GameService = {

  getMetadata: function(callBack) {
    FS.Describe("Players__c", function(err, metadata) {
      if (err) {
        console.log(err);
        return callBack(err, null);
      }

      callBack(null, metadata);
    });
  },
  // upserts player
  getPlayerDetails: function(id, callBack) {
    var query = "Select id, email__c, name, service_line__c from Players__c where id = \'" + id + "\'";


    FS.Query(query, function(err, data) {
      if (err) {
        console.info('error while getting questions from SFDC');
        return callBack(err, null);
      }

      return callBack(null, data.records);
    });
  },
  createPlayer: function(data, callBack) {

    var query = "Select id from Players__c where Email__c = \'" + data.Email__c + "\'";
    FS.Query(query, function(err, findResp) {

      if (err) {
        return callBack(err, null);
      }

      if (findResp.totalSize) {

        console.info('\nUser found so returning userID\n');
        callBack(null, findResp.records[0].Id);
      } else {

        console.info('\nUser not found so creating a player in SFDC.\n');
        FS.create('Players__c', data, function(err, createResp) {
          if (err) {
            callBack(err, null);
          } else {
            callBack(null, createResp.id);
          }
        });
      }
    });
  },
  getQuestions: function(callBack) {

    var query = "Select id, Question_1__c, a__c, b__c, c__c, d__c, hint__c, correct_answer__c from Question__c";

    FS.Query(query, function(err, data) {
      if (err) {
        console.info('error while getting questions from SFDC');
        return callBack(err, null);
      }

      randomizeQuestions(data.records, function(questions) {
        callBack(questions);
      });
    });
  },
  checkAnswer: function(qNo, answered, callBack) {

    var query = "Select a__c, b__c, c__c, d__c, correct_answer__c from Question__c where id = \'" + qNo + "\'";

    FS.Query(query, function(err, data) {
      if (err) {
        return callBack(err, null);
      }

      if (data.records[0][data.records[0].Correct_Answer__c + '__c'] === answered) {
        callBack(null, {
          answeredCorrect: true,
          correctOption: data.records[0].Correct_Answer__c
        });
      } else {
        callBack(null, {
          answeredCorrect: false,
          correctOption: data.records[0].Correct_Answer__c
        });
      }
    });


  },
  createAttempt: function(data, callBack) {

    var getUncheckedRecordsQuery = 'Select Id, Attempt_Completed__c From Player_Attempt__c where Attempt_Completed__c = false and player__c =\'' + data.Player__c + '\'';

    FS.Query(getUncheckedRecordsQuery, function(err, resp) {
      if (err) {
        return callBack(err, null);
      }

      ASYNC.each(resp.records, function(item, cb) {
        FS.upsert('Player_Attempt__c', {
          Attempt_Completed__c: true
        }, item.Id, function(err, resp) {
          if (err) {
            return cb(err, null);
          }
          cb(null, resp);
        });
      }, function(err) {
        if (err) {
          return callBack(err, null);
        }


        data.Correct_Answers__c = 0;
        data.Total_Questions_Attempted__c = 0;
        data.Negative_Tokens_Caught__c = 0;
        data.Positive_Tokens_Caught__c = 0;
        data.Time_Taken__c = 0;
        data.Token_Points__c = 0;

        FS.create('Player_Attempt__c', data, function(err, resp) {
          if (err) {
            console.info('Error wile saving attempt data in SFDC');
            console.info(err);
            callBack(err, null);
          }
          callBack(null, resp);
        });
      });
    });

  },
  updateAttempt: function(id, isAnswerCorrect, rawData, callBack) {
    var getAttemptQuery = 'SELECT Correct_Answers__c,Time_Taken__c, Total_Questions_Attempted__c, Negative_Tokens_Caught__c, Positive_Tokens_Caught__c, Attempt_Completed__c FROM Player_Attempt__c where id = \'' + id + '\'';
    FS.Query(getAttemptQuery, function(err, resp) {
      if (err) {
        return callBack(err, null);
      }

      // Validate the Token signature
      var valid = checkHash(rawData, resp.records[0]);
      if (!valid) {
        return callBack({
          'err': 'Signature does not match'
        }, null);
      }

      

      if (resp.records[0].Attempt_Completed__c) {
        return callBack({
          'err': 'Record is locked and cannot be edited anymore'
        }, null);
      } else {

        var data = {
          Negative_Tokens_Caught__c: rawData.Negative_Tokens_Caught__c,
          Positive_Tokens_Caught__c: rawData.Positive_Tokens_Caught__c,
          Time_Taken__c: rawData.Time_Taken__c
        };

        data.Total_Questions_Attempted__c = resp.records[0].Total_Questions_Attempted__c + 1;
        if (parseInt(data.Negative_Tokens_Caught__c, 10) > 10) {
          data.Negative_Tokens_Caught__c = 0;
        } else {
          data.Negative_Tokens_Caught__c = (parseInt(resp.records[0].Negative_Tokens_Caught__c, 10) + parseInt(data.Negative_Tokens_Caught__c, 10));
        }

        if (parseInt(data.Positive_Tokens_Caught__c, 10) > 10) {
          data.Positive_Tokens_Caught__c = 0;
        } else {
          data.Positive_Tokens_Caught__c = (parseInt(resp.records[0].Positive_Tokens_Caught__c, 10) + parseInt(data.Positive_Tokens_Caught__c, 10));
        }


        data.Time_Taken__c = (parseInt(data.Time_Taken__c, 10) <= parseInt(resp.records[0].Time_Taken__c, 10)) ? 120 : parseInt(data.Time_Taken__c, 10);

        data.Token_Points__c = (data.Positive_Tokens_Caught__c - data.Negative_Tokens_Caught__c) * 10;


        if (isAnswerCorrect) {
          data.Correct_Answers__c = resp.records[0].Correct_Answers__c + 1;
        }

        if (data.Correct_Answers__c === 5 || data.Time_Taken__c >= 120) {
          data.Attempt_Completed__c = true;
        }

        FS.upsert('Player_Attempt__c', data, id, function(err, updatedData) {
          if (err) {
            return callBack(err, null);
          }
          callBack(null, data.Attempt_Completed__c || false);
        });
      }

    });
  },
  saveAttempt: function(id, rawData, callBack) {

    var data = {
      Time_Taken__c: 120,
      Attempt_Completed__c: true,
      Negative_Tokens_Caught__c: rawData.Negative_Tokens_Caught__c,
      Positive_Tokens_Caught__c: rawData.Positive_Tokens_Caught__c
    }

    var getAttemptQuery = 'SELECT Negative_Tokens_Caught__c, Positive_Tokens_Caught__c FROM Player_Attempt__c where id = \'' + id + '\'';
    FS.Query(getAttemptQuery, function(err, resp) {
      if (err) {
        return callBack(err, null);
      }

      // Validate the Token Signature
      if (!checkHash(rawData, resp.records[0])) {
        return callBack({
          'err': 'Signature does not match'
        }, null);
      }

      if (resp.records[0].Attempt_Completed__c) {
        return callBack({
          'err': 'Record is locked and cannot be edited anymore'
        }, null);
      } else {

        data.Negative_Tokens_Caught__c = (parseInt(resp.records[0].Negative_Tokens_Caught__c, 10) + parseInt(data.Negative_Tokens_Caught__c, 10));
        data.Positive_Tokens_Caught__c = (parseInt(resp.records[0].Positive_Tokens_Caught__c, 10) + parseInt(data.Positive_Tokens_Caught__c, 10));
        data.Token_Points__c = (data.Positive_Tokens_Caught__c - data.Negative_Tokens_Caught__c) * 10;

        FS.upsert('Player_Attempt__c', data, id, function(err, resp) {
          if (err) {
            return callBack(err, null);
          }
          callBack(null, resp);
        });
      }

    });
  },
  // gets current winner from SFDC.
  getWinner: function(callBack) {
    var query = "Select Id, Player__r.Name, Final_Score__c, Player__r.Email__c  From Player_Attempt__c where Attempt_Completed__c = true Order BY Final_Score__c DESC limit 1";

    FS.Query(query, function(err, data) {
      if (err) {
        return callBack(err, null);
      }

      return callBack(null, data.records[0]);
    });
  },
  // get last attempts of a user
  lastAttempts: function(id, offset, callBack) {
    var query = "SELECT Correct_Answers__c, Final_Score__c, Id, Name, Negative_Tokens_Caught__c, Player__c, Positive_Tokens_Caught__c, Time_Taken__c, Token_Points__c, Total_Questions_Attempted__c, Total_Tokens_Caught__c FROM Player_Attempt__c where Attempt_Completed__c = true AND player__c in (Select id from Players__c where id = \'" + id + "\' ) ORDER BY CreatedDate DESC limit " + offset;

    FS.Query(query, function(err, data) {
      if (err) {
        return callBack(err, null);
      }

      return callBack(null, data.records);
    });
  }
}

function checkHash(reqData, sfData) {
  var pToken = (parseInt(sfData.Positive_Tokens_Caught__c, 10) + parseInt(reqData.Positive_Tokens_Caught__c, 10))
  var nToken = (parseInt(sfData.Negative_Tokens_Caught__c, 10) + parseInt(reqData.Negative_Tokens_Caught__c, 10))
  var tokenScore = (pToken -nToken) * 10
  var hash = md5(tokenScore + Math.floor(new Date().getUTCMinutes()/5));
  console.log(Math.floor(new Date().getUTCMinutes()/5));

  return (hash === reqData.Sign__c)
}



module.exports = GameService;
