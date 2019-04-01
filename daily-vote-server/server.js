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
    storage.getAllQuestionsForSurvey(req.params.survey).then(survey => {
        res.send({ success: true, survey })
    });
});

app.get("/api/:survey/votes", (req, res) => {
    console.log(req.headers['content-type']);
    storage.getAllVotesForSurvey(req.params.survey).then(votes =>{
        if (req.headers['content-type'] === "text/csv") {
            res.set('Content-Type', 'text/csv');
            res.set('Content-Disposition', 'attachment; filename="votes.csv"');
            if (!votes || votes.length < 1) {
                return res.send();
            }

            const headers = ["question", "round", "date", "rating", "totalRatings"]
            let result = `${headers.join(',')}\n`;
            const part = votes.reduce((result, vote) => {
                const {question, rating} = vote; 
                const date = vote.date.toJSON().slice(0,10);
                result[question] = result[question] || {}
                result[question][date] = result[question][date] || {sum: 0, count: 0};

                result[question][date].sum += rating;
                result[question][date].count++;
                return result;
            }, {})
            Object.keys(part).forEach(question => {
                Object.keys(part[question]).forEach((date, index) => {
                    const item = part[question][date];
                    console.log(part)
                    console.log(`${question}, ${date}`)
                    console.log(item)
                    result += `"${question}",${index+1},${date},${(item.sum / item.count).toLocaleString("de")},${item.count}\n`;
                })
            }) 
            res.send(result);
        } else res.send({ success: true, votes })
    });
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
        res.send({ids, yes: `/api/${survey}/vote/1/${ids[0]}`, no: `/api/${survey}/vote/-1/${ids[0]}`});
    })
})
app.post("/api/:survey/notify", (req, res) => {
    const { survey } = req.params;
    if (req.headers["x-auth-generator"] !== process.env.GENERATOR_KEY) {
        return res.send("you wish...");
    }

    storage.getAllSurveysFull().then(surveys => {
        const { subscriber } = surveys[survey];
        return notifyUserForSurvey({survey, subscribers : subscriber });
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