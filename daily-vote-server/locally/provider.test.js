const { describe, it, expect } = require('mocha-sinon-chai');
const { getQuestionOfTheDay } = require('./provider');
const example = require('../surveys/example');
const timings = require('../surveys/timings');

describe("Question of the day", () => {
    describe("Given there are 7 questions and we start on Monday", () => {

        describe("And it is the first day", () => {
            it("should return the first question", () => {
                return getQuestionOfTheDay({
                    survey: "timings",
                    forDate: "2018-10-01T00:00:00.000Z"
                }).then(({ question }) => {
                    expect(question).to.eq(timings.questions[0].question);
                });
            });
        });

        describe("And it is the second day", () => {
            it("should return the second question", () => {
                return getQuestionOfTheDay({
                    survey: "timings",
                    forDate: "2018-10-02T00:00:00.000Z"
                }).then(({ question }) => {
                    expect(question).to.eq(timings.questions[1].question);
                });
            });
        });

        describe("And it is the second monday", () => {
            it("should return the 6th question, because no questions on saturday and sunday", () => {
                return getQuestionOfTheDay({
                    survey: "timings",
                    forDate: "2018-10-08T00:00:00.000Z"
                }).then(({ question }) => {
                    expect(question).to.eq(timings.questions[5].question);
                });
            });
        });

        describe("And it is the second tuesday", () => {
            it("should return the 7th question, because no questions on saturday and sunday", () => {
                return getQuestionOfTheDay({
                    survey: "timings",
                    forDate: "2018-10-09T00:00:00.000Z"
                }).then(({ question }) => {
                    expect(question).to.eq(timings.questions[6].question);
                });
            });
        });

        describe("And it one iteration later", () => {
            it("on the first day it should return the first question", () => {
                return getQuestionOfTheDay({
                    survey: "timings",
                    forDate: "2018-10-17T00:00:00.000Z"
                }).then(({ question }) => {
                    expect(question).to.eq(timings.questions[0].question);
                });
            });
            it("on the third day should return the third question", () => {
                return getQuestionOfTheDay({
                    survey: "timings",
                    forDate: "2018-10-19T00:00:00.000Z"
                }).then(({question}) => {
                    expect(question).to.eq(timings.questions[2].question);
                });
            });
            it("on the monday day should return the fourth question", () => {
                return getQuestionOfTheDay({
                    survey: "timings",
                    forDate: "2018-10-22T00:00:00.000Z"
                }).then(({question}) => {
                    expect(question).to.eq(timings.questions[3].question);
                });
            });
        })

    })
});

describe("Question of the day", () => {
    describe("Given there are 7 questions and we start on Monday", () => {

        describe("And it is the first day", () => {
            it("should return the first question", () => {
                return getQuestionOfTheDay({
                    survey: "example",
                    forDate: "2018-10-01T00:00:00.000Z"
                }).then(({ question }) => {
                    expect(question).to.eq(example.questions[0].question);
                });
            });
        });

        describe("And it is the second day", () => {
            it("should return the second question", () => {
                return getQuestionOfTheDay({
                    survey: "example",
                    forDate: "2018-10-02T00:00:00.000Z"
                }).then(({ question }) => {
                    expect(question).to.eq(example.questions[1].question);
                });
            });
        });

        describe("And it is the second monday", () => {
            it("should return the 6th question, because no questions on saturday and sunday", () => {
                return getQuestionOfTheDay({
                    survey: "example",
                    forDate: "2018-10-08T00:00:00.000Z"
                }).then(({ question }) => {
                    expect(question).to.eq(example.questions[5].question);
                });
            });
        });

        describe("And it is the second tuesday", () => {
            it("should return the 7th question, because no questions on saturday and sunday", () => {
                return getQuestionOfTheDay({
                    survey: "example",
                    forDate: "2018-10-09T00:00:00.000Z"
                }).then(({ question }) => {
                    expect(question).to.eq(example.questions[6].question);
                });
            });
        });

        describe("And it one iteration later", () => {
            it("on the first day it should return the first question", () => {
                return getQuestionOfTheDay({
                    survey: "example",
                    forDate: "2018-10-10T00:00:00.000Z"
                }).then(({ question }) => {
                    expect(question).to.eq(example.questions[0].question);
                });
            });
            it("on the third day should return the third question", () => {
                return getQuestionOfTheDay({
                    survey: "example",
                    forDate: "2018-10-12T00:00:00.000Z"
                }).then(({question}) => {
                    expect(question).to.eq(example.questions[2].question);
                });
            });
            it("on the monday day should return the fourth question", () => {
                return getQuestionOfTheDay({
                    survey: "example",
                    forDate: "2018-10-14T00:00:00.000Z"
                }).then(({question}) => {
                    expect(question).to.eq(example.questions[3].question);
                });
            });
        })

    })
});