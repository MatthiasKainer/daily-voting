require('dotenv').config();

const Cryptr = require('cryptr');
const fs = require('fs');
const path = require('path');

const surveys = require(process.env.RAW_SURVEYS);

const cryptr = new Cryptr(process.env.CRYPTO_KEY);

Object.keys(surveys).forEach(surveyName => {
    const survey = surveys[surveyName];
    survey.subscriber = survey.subscriber.map(cryptr.encrypt);
    const content = JSON.stringify(survey, undefined, 2);

    const file = `const survey = ${content};

module.exports = survey;   `
    fs.writeFile(`./daily-vote-server/surveys/${surveyName}.js`, file, (err) => {
        if (err) console.log(`Could not store file ${surveyName}.js, please try again. Error: ${err}`);
    })
});

fs.copyFile(path.join(process.env.RAW_SURVEYS, 'index.js'), `./daily-vote-server/surveys/index.js`, (err) => {
    if (err) console.log(`Could not copy the index.js, please try again. Error: ${err}`);
})

