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
            notifyUserForSurvey({ survey, subscribers: subscriber });
        })
    }).catch(err => {
        console.log("could not send (all) emails!");
        console.log(err);
    });
}

function notifyUserForSurvey({ survey, subscribers }) {
    return storage.getQuestionOfTheDay({
        survey: survey,
        forDate: new Date().toISOString()
    }).then(({ question }) =>
        storage.generateVotingIds(survey, subscribers.length)
            .then(ids => {
                subscribers.forEach((subscriber, index) => {
                    // set no more then one email every second
                    setTimeout(() => 
                        send(prepare(subscriber, survey, question, ids[index].toString()))
                    , 1000 * index)
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

function send(messages, retry) {
    if (retry === undefined) { retry = 4; }
    return sgMail.send(messages).catch(error => {
        // try again in 5 sec if retry allows it 
        if (retry > 0)
            setTimeout(() => send(messages, retry-1, 5000));
        //Log friendly error
        console.error(error);
        console.log(`Messages could not be send to ${messages.to}! Trying again for ${retry} times`)
    });
}

module.exports = { startScheduling, notifyUsers, notifyUserForSurvey };