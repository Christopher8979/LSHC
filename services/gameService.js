var QUESTIONS = require('../data/questions.json').questions;
var _ = require('lodash');
var FS = require('./ForceService.js');


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

  // upserts player
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
  saveAttempt: function(data, callBack) {

    FS.create('Player_Attempt__c', data, function(err, resp) {
      if (err) {
        console.info('Error wile saving attempt data in SFDC');
        console.info(err);
        callBack(err, null);
      }

      callBack(null, resp);
    });
  },
  // gets current winner from SFDC.
  getWinner: function(callBack) {
    var query = "Select Id, Player__r.Name,Final_Score__c From Player_Attempt__c Order BY Final_Score__c, Question_Answer_Ratio__c, Time_Ratio__c, Token_Points__c DESC limit 1";

    FS.Query(query, function(err, data) {
      if (err) {
        return callBack(err, null);
      }

      return callBack(null, data.records[0]);
    });
  },
  // get last attempts of a user
  lastAttempts: function(id, offset, callBack) {
    var query = "SELECT Correct_Answers__c, Final_Score__c, Id, Name, Negative_Tokens_Caught__c, Player__c, Positive_Tokens_Caught__c, Time_Taken__c, Token_Points__c, Total_Questions_Attempted__c, Total_Tokens_Caught__c FROM Player_Attempt__c where player__c in (Select id from Players__c where id = \'" + id + "\' ) ORDER BY CreatedDate DESC limit " + offset;

    FS.Query(query, function(err, data) {
      if (err) {
        return callBack(err, null);
      }

      return callBack(null, data.records);
    });
  }
}



module.exports = GameService;
