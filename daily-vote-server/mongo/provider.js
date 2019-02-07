const { MongoClient, ObjectId } = require('mongodb');
const { DateTime } = require('luxon');

let db;

const { MONGO_DB, MONGO_USER, MONGO_PASS, MONGO_COLLECTION, MONGO_AUTH_SOURCE } = process.env;

function client() {

    this.generateVotingIds = (survey, length) => {
        const entries = Array.from({ length }, () => {
            return { date: new Date().toISOString() };
        });
        return new Promise((resolve, reject) => {
            connect().then(db => {
                db.collection(`slots-for-${survey}`).insertMany(entries, (err, result) => {
                    return (err)
                        ? reject(err)
                        : resolve(result.insertedIds)
                });
            }).catch((err) => {
                console.log(err);
                return reject(err);
            });
        })
    }

    this.voteFor = (survey, id, body) => {
        return new Promise((resolve, reject) => {
            connect().then(db => {
                db.collection(`slots-for-${survey}`).findOneAndDelete({ _id: ObjectId(id) }, (err, result) => {
                    if (err) return reject(err);
                    if (!result || !result.value || !DateTime.fromISO(result.value.date).hasSame(DateTime.local(), 'day')) {
                        return this.getAllVotesForSurvey(survey)
                            .then(resolve)
                            .catch(reject);
                    }

                    db.collection(`votes-for-${survey}`).insertOne(body, (err, result) => {
                        return (err)
                            ? reject(err)
                            : this.getAllVotesForSurvey(survey)
                                .then(resolve)
                                .catch(reject);
                })
                });
            }).catch((err) => {
                console.log(err);
                return reject(err);
            });
        })
    };

    this.getAllVotesForSurvey = (survey) => {
        return new Promise((resolve, reject) => {
            connect().then(db => {
                db.collection(`votes-for-${survey}`).find({}).toArray(function (err, result) {
                    return (err)
                        ? reject(err)
                        : resolve(result);
                });
            }).catch((err) => {
                console.log(err);
                return reject(err);
            });
        })
    }

    return this;
}

async function connect() {
    if (db) return Promise.resolve(db);
    return MongoClient.connect(`mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_DB}`, { authSource: MONGO_AUTH_SOURCE })
        .then(database => {
            db = database.db(MONGO_COLLECTION);
            return db;
        })
}

module.exports = client();