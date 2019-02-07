import {getLocalQuestionOfTheDay} from "../../..daily-vote-server//questionService";

describe("Question of the day", () => {
    describe("Given there are 7 questions and we start on Monday", () => {
        const questions = Array.apply(null, {length: 7})
            .map(Number.call, Number)
            .map(number => { return { question : `question ${number}` }; })
        describe("And it is the first day", () => {
            it("should return the first question", () => {
                const {question} = getLocalQuestionOfTheDay({
                    questions, 
                    forDate : new Date(2018, 10, 1).toISOString(),
                    day : new Date(2018, 10, 1).toISOString()
                });
                expect(question).toBe(questions[0].question);
            });
        });

        describe("And it is the second day", () => {
            it("should return the second question", () => {
                const {question} = getLocalQuestionOfTheDay({
                    questions, 
                    forDate : new Date(2018, 10, 1).toISOString(),
                    day : new Date(2018, 10, 2).toISOString()
                });
                expect(question).toBe(questions[1].question);
            });
        });

        describe("And it is the second monday", () => {
            it("should return the 6th question, because no questions on saturday and sunday", () => {
                const {question} = getLocalQuestionOfTheDay({
                    questions, 
                    forDate : new Date(2018, 10, 1).toISOString(),
                    day : new Date(2018, 10, 8).toISOString()
                });
                expect(question).toBe(questions[5].question);
            });
        });

        describe("And it one iteration later", () => {
            it("on the first day it should return the first question", () => {
                const {question} = getLocalQuestionOfTheDay({
                    questions, 
                    forDate : new Date(2018, 10, 1).toISOString(),
                    day : new Date(2018, 10, 10).toISOString()
                });
                expect(question).toBe(questions[0].question);
            });
            it("on the third day should return the third question", () => {
                const {question} = getLocalQuestionOfTheDay({
                    questions, 
                    forDate : new Date(2018, 10, 1).toISOString(),
                    day : new Date(2018, 10, 13).toISOString()
                });
                expect(question).toBe(questions[2].question);
            });
        })

    })
});