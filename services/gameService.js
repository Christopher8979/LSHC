var QUESTIONS = require('../data/questions.json').questions;
var _ = require('lodash');


var randomizeQuestions = function(callBack) {
  var indexArray = [];
  var randomizedIndex = [];
  var randomizedQuestions = [];
  var someIndex = 0;

  QUESTIONS.forEach(function(value, index) {
    indexArray.push(index);
  });

  for (var i = 0; randomizedIndex.length < indexArray.length; i++) {
    someIndex = Math.floor(Math.random() * (indexArray.length));
    if (randomizedIndex.indexOf(someIndex) === -1) {
      randomizedIndex.push(someIndex);
    }
  }

  randomizedIndex.forEach(function(indexValue) {
    randomizedQuestions.push(QUESTIONS[indexValue]);
  });

  callBack(randomizedQuestions);
};

var GameService = {

  getQuestions: function(callBack) {
    randomizeQuestions(function(questions) {
      callBack(questions);
    });
  },
  checkAnswer: function(qNo, answered, callBack) {
    var questionObj = _.find(QUESTIONS, function(ques) {
      return ques.id === qNo;
    });

    if (questionObj.answer === answered) {
      callBack(null, true);
    } else {
      callBack(true, null);
    }
  }
}



module.exports = GameService;
