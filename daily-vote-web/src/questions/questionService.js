import { hash } from './hash';
const { DateTime } = require('luxon');

export function getQuestionOfTheDay(name) {
    return fetch(`/api/${name}/question/now`, {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(checkStatus)
        .then(parseJSON);
}


export function getLocalQuestionOfTheDay({ 
    questions, 
    forDate, 
    day = DateTime.local().toJSDate() 
}) {
    if (!day) day = DateTime.local().toJSDate() ;
    if (questions.length < 1) return { question: "" };
    const start = DateTime.fromISO(forDate);
    const maxQuestions = questions.length;
    const end = DateTime.fromISO(day);
    const { days } = end.diff(start, 'days').toObject();
    let index = 0;
    for (let day = 0; day < days; day++) {
        const { weekday } = start.plus({ days: day });
        if (weekday !== 6 && weekday !== 7) {
            index++;
        }

        if (index >= maxQuestions) {
            index = 0;
        }
    }

    return (questions.length > index)
        ? questions[index]
        : { question: "" };
}

export function getSurvey(name) {
    return fetch(`/api/${name}`, {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(checkStatus)
        .then(parseJSON);
}

export function getVotes(name) {
    return fetch(`/api/${name}/votes`, {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(checkStatus)
        .then(parseJSON);
}

export function voteFor({ name, date, rating }) {
    let { voteId } = hash;
    return fetch(`/api/${name}/votes`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-vote-id': voteId
        },
        body: JSON.stringify({ date, rating })
    })
        .then(checkStatus)
        .then(parseJSON);
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
}

function parseJSON(response) {
    return response.json();
}