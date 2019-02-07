# Daily Vote

This is a very basic application to run a daily voting. It consists of two parts, server and web, and setup to be deployed to a heroku dynamo.

# Adding a survey

A survey cannot directly be added as the email addresses are to be encrypted. 

First create a folder to put in your unencrypted emails, add it to the `.gitignore` file, and create the following two files:

```js
const survey = {
    startDate: "2018-10-01T00:00:00.000Z",
    questions: [
        {
            question: "is gras green?"
        }
    ],
    subscriber: [
        "example@example"
    ]
};
module.exports = survey;
```
_example.js_

```js
const example = require('./example');

module.exports = {example};
```
_index.js_

Next you need your environment to be setup with some variables:

```
RAW_SURVEYS=<Folder to the two files you created>
CRYPTO_KEY=<The key to encrypt/decrypt the emails>
```

Note that the development version supports [dotenv](https://github.com/motdotla/dotenv), so by placing a `.env` file in your folder you can set your parameters. 

Now run `npm run generate-surveys` and the example survey will be created

# Development

You need a mongo with authentication running, and your environment set up. If you have a mongo like
`docker run --name daily-vote -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=user -e MONGO_INITDB_ROOT_PASSWORD=pass -e MONGO_INITDB_DATABASE=daily-vote -d mongo`

Then you need an environment that looks like this:

```
MONGO_DB=localhost:27017
MONGO_USER=user
MONGO_PASS=pass
MONGO_AUTH_SOURCE=admin
MONGO_COLLECTION=daily-vote
```

to execute administrative tasks (i.e. regenerate survey invitations) you will also require a `GENERATOR_KEY` variable

Then run `npm install` and `npm start-all` to boot up a development environment with server and client running.

# Deployment

You'll need a [sendgrid](https://sendgrid.com/) account for the daily emails, a mongodb (i.e. to get started a free one via [mlab](https://mlab.com/)) and a heroku account.

Setup heroku with the environment variables from above, and an additional `SENDGRID_API_KEY` with the API key you received from sendgrid. 

Make sure your heroku cli is connected. 

Then run `npm run deploy`

# API

## Server

