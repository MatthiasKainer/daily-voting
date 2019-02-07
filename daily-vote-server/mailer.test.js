const { describe, beforeEach, it, expect, stub } = require('mocha-sinon-chai');

const sgMail = require('@sendgrid/mail');
const storage = require('./storage');

describe("When notifying the users", () => {
    beforeEach(() => {
        stub(sgMail, 'send');
    });

    describe("When there are no surveys", () => {
        it("should not send any emails");
    })

    describe("When there are ")

    it("should send the email for all receipients")
})