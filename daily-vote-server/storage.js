const localStorage = require('./locally/provider');
const mongo = require('./mongo/provider');

let { getAllSurveys,
    getAllQuestionsForSurvey,
    getQuestionOfTheDay,
    getAllVotesForSurvey,
    voteFor,
    generateVotingIds,
    getAllSurveysFull
} = localStorage;

if (process.env.MONGO_DB) {
    console.log("Using mongodb...");
    voteFor = mongo.voteFor;
    getAllVotesForSurvey = mongo.getAllVotesForSurvey;
    generateVotingIds = mongo.generateVotingIds;
}

module.exports = {
    getAllSurveys,
    getAllSurveysFull,
    getAllQuestionsForSurvey,
    getQuestionOfTheDay,
    getAllVotesForSurvey,
    voteFor,
    generateVotingIds
};