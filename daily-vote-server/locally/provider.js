const state = require('../surveys');
const { DateTime } = require('luxon');

const votes = {};

function generateVotingIds(count) {
    return Promise.resolve(Array.from({ count }, (v, k) => k));
}

function getAllSurveys() {
    return Promise.resolve(Object.keys(state));
}

function getAllSurveysFull() {
    const surveys = Object.keys(state);

    return Promise.resolve(surveys.reduce((prev, curr) => {
        prev[curr] = state[curr];
        prev[curr].name = curr;
        return prev;
    }, {}));
}

function getAllQuestionsForSurvey(survey) {
    const { questions, startDate } = state[survey];
    return Promise.resolve({ questions, startDate });
}

function getQuestionOfTheDay({ survey, forDate }) {
    return getAllQuestionsForSurvey(survey).then(({ startDate, questions }) => {
        if (questions.length < 1) return { question: "" };
    
        const start = DateTime.fromISO(startDate);
        const maxQuestions = questions.length;
        const end = forDate ? DateTime.fromISO(forDate) : DateTime.local();
        const days = Math.floor(end.diff(start, 'days').toObject().days);
        let index = 0;
        for (let day = 0; day < days; day++) {
            const { weekday } = start.plus({ days: day });
            if (weekday !== 6 && weekday !== 7) {
                index++;

                if (index >= maxQuestions) {
                    index = 0;
                }
            }
        }

        return Promise.resolve((questions.length > index)
            ? questions[index]
            : { question: "" });
    });
}

function getAllVotesForSurvey(survey) {
    return Promise.resolve(votes[survey]);
}

function voteFor(survey, id, body) {
    votes[survey] = votes[survey] || [];
    votes[survey].push(body);
    return Promise.resolve(votes[survey]);
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
