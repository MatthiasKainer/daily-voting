const sgMail = require('@sendgrid/mail');
const Cryptr = require('cryptr');
const storage = require('./storage');
const schedule = require('node-schedule');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const cryptr = new Cryptr(process.env.CRYPTO_KEY);

function startScheduling() {
    schedule.scheduleJob('0 7 * * 1-5', () => {
        console.log(`Sending reminder emails...`);
        notifyUsers();
    });
}

function notifyUsers() {
    return storage.getAllSurveysFull().then(surveys => {
        Object.keys(surveys).forEach(survey => {
            const { subscriber } = surveys[survey];
            notifyUserForSurvey({ survey, subscriber });
        })
    }).catch(err => {
        console.log("could not send (all) emails!");
        console.log(err);
    });
}

function notifyUserForSurvey({ survey, subscriber: subscribers }) {
    return storage.getQuestionOfTheDay({
        survey: survey,
        forDate: new Date().toISOString()
    }).then(({ question }) =>
        storage.generateVotingIds(survey, subscribers.length)
            .then(ids => {
                subscribers.forEach((subscriber, index) => {
                    send(prepare(subscriber, survey, question, ids[index].toString()), subscriber);
                })
            })
    ).catch(err => {
        console.log(`could not send emails for survey ${survey}!`);
        console.log(err);
    });
}

function prepare(to, survey, todaysQuestion, id) {
    const msg = {
        to: cryptr.decrypt(to),
        from: process.env.EMAIL_FROM,
        subject: 'A new question is up!',
        text: `
  A new question is available in the daily survey ${survey}!
  
  Todays question is: ${todaysQuestion}

  Go to https://${process.env.HOST || "localhost:3000"}#survey=${survey}&voteId=${id}
  and answer the question now, or open the following urls to cast a direct vote:

  Yes: https://${process.env.HOST || "localhost:3000"}/api/${survey}/vote/1/${id}
  No: https://${process.env.HOST || "localhost:3000"}/api/${survey}/vote/-1/${id}
`
    };

    return msg;
}

function send(messages) {
    return sgMail.send(messages).catch(error => {
        //Log friendly error
        console.error(error.toString());
        console.log(`Messages could not be send to ${messages.to}!`)
    });
}

module.exports = { startScheduling, notifyUsers, notifyUserForSurvey };