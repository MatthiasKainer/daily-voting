require('dotenv').config();
const express = require("express");
var bodyParser = require('body-parser');
const storage = require('./storage');
const { startScheduling, notifyUserForSurvey } = require('./mailer');
const schedule = require('node-schedule');
const https = require('https');

const app = express();

app.set("port", process.env.PORT || 3001);

app.use(express.static("./public"));
app.use(bodyParser.json());

app.get("/api", (req, res, next) => {
    storage.getAllSurveys().then(surveys =>
        res.send({ success: true, surveys })
    ).catch(next);
});

app.get("/api/:survey", (req, res) => {
    storage.getAllQuestionsForSurvey(req.params.survey).then(survey =>
        res.send({ success: true, survey })
    );
});

app.get("/api/:survey/votes", (req, res) => {
    storage.getAllVotesForSurvey(req.params.survey).then(votes =>
        res.send({ success: true, votes })
    );
});

app.get("/api/:survey/question/now", (req, res) => {
    const { survey } = req.params;
    storage.getQuestionOfTheDay({ survey, forDate: new Date().toISOString() }).then(({ question }) =>
        res.send({ success: true, question })
    );
});

const sanitizeBody = ({ body }) => {
    body.date = new Date();
    body.rating = parseInt(body.rating) < 0 ? -1 : 1;
    return body;
}

app.post("/api/:survey/votes", (req, res) => {
    const { survey } = req.params;
    const body = sanitizeBody(req);
    storage.getQuestionOfTheDay({ survey, byDate: new Date().toISOString() }).then(({ question }) => {
        body.question = question;
        body.date = new Date();
        storage.voteFor(survey, req.headers["x-vote-id"], body).then(votes =>
            res.send({ success: true, votes })
        )
    });
});

app.get("/api/:survey/vote/:rating/:voteid", (req, res) => {
    const { survey, rating, voteid } = req.params;
    const body = sanitizeBody({ body: { rating } });
    storage.getQuestionOfTheDay({ survey, byDate: new Date().toISOString() }).then(({ question }) => {
        body.question = question;
        storage.voteFor(survey, voteid, body).then(votes =>
            res.redirect(`/#survey=${survey}&voted=true`)
        )
    });
});

app.post("/api/:survey/voteId", (req, res) => {
    const { survey } = req.params;
    if (req.headers["x-auth-generator"] !== process.env.GENERATOR_KEY) {
        return res.send("you wish...");
    }

    storage.generateVotingIds(survey, 1).then(ids => {
        res.send(ids);
    })
})
app.post("/api/:survey/notify", (req, res) => {
    const { survey } = req.params;
    if (req.headers["x-auth-generator"] !== process.env.GENERATOR_KEY) {
        return res.send("you wish...");
    }

    storage.getAllSurveysFull().then(surveys => {
        const { subscriber } = surveys[survey];
        return notifyUserForSurvey({survey, subscriber});
    })
    .then(() => {
        res.send("sent...")
    });
});

app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console

    schedule.scheduleJob('*/15 * * * *', () => {
        console.log("ping myself");
        https.get(`https://${process.env.HOST || "localhost:3000"}`, (resp) => {
            console.log("Some response received pinging myself");
        }).on("error", (err) => {
            console.log("Error pinging myself: " + err.message);
        });
    });

    startScheduling();
});