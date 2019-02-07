
const { DateTime } = require('luxon');

const map = (votes) => {
    const votesPerQuestionAndDay = votes.reduce((prev, vote) => {
        const voteDay = DateTime.fromISO(vote.date).toFormat('yyyyMMdd');
        prev[vote.question] = prev[vote.question] || {};
        prev[vote.question][voteDay] = prev[vote.question][voteDay] || { result : 0, count : 0 };
        prev[vote.question][voteDay].result = (prev[vote.question][voteDay].result || 0) + vote.rating;
        prev[vote.question][voteDay].count++;
        return prev;
    }, {});

    const iterations = Object.keys(votesPerQuestionAndDay).reduce((result, question, questionIndex) => {
        Object.keys(votesPerQuestionAndDay[question]).forEach((day, index) => {
            result[`Iteration ${index}`] = result[`Iteration ${index}`] || {data : []};
            result[`Iteration ${index}`].data.push({
                x : question,
                y : votesPerQuestionAndDay[question][day].result / votesPerQuestionAndDay[question][day].count
            })
        })
        return result;
    }, {});

    return Object.keys(iterations).map(iteration => ({...iterations[iteration], series: iteration}))
};

export default map;