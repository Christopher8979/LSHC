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
    FS.upsert('Players__c', data, 'Email__c', function(err, data) {
      if (err) {
        return callBack(err, null);
      }

      callBack(null, data);
    });
  },
  getQuestions: function(callBack) {

    var query = "Select id, Question_1__c, a__c, b__c, c__c, d__c, correct_answer__c from Question__c";

    FS.Query(query, function(err, data) {
      if (err) {
        return callBack(err, null);
      }

      console.log(data.records);
      randomizeQuestions(data.records, function(questions) {
        callBack(questions);
      });
    });
  },
  checkAnswer: function(qNo, answered, callBack) {
    var questionObj = _.find(QUESTIONS, function(ques) {
      return ques.id === qNo;
    });

    if (questionObj.answer === answered) {
      callBack(null, true);
    } else {
      callBack(null, false);
    }
  },
  // gets current winner from SFDC.
  getWinner: function(callBack) {
    var query = "";

    return callBack(null, {});
  },
  // get last attempts of a user
  lastAttempts: function(userMail, offset, callBack) {
    var query = "SELECT Correct_Answers__c, Final_Score__c, Id, Name, Negative_Tokens_Caught__c, Player__c, Positive_Tokens_Caught__c, Time_Taken__c, Token_Points__c, Total_Questions_Attempted__c, Total_Tokens_Caught__c FROM Player_Attempt__c where player__c in (Select id from Players__c where Email__c = \'" + userMail + "\' ) ORDER BY CreatedDate DESC limit " + offset;

    FS.Query(query, function(err, data) {
      if (err) {
        return callBack(err, null);
      }

      return callBack(null, data);
    });
  }
}



module.exports = GameService;
