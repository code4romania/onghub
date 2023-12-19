"use strict";
const AmplifyBackend = require('aws-sdk/clients/amplifybackend');
exports.handler = async (event, context) => {
    try {
        const amplifyBackendService = new AmplifyBackendService(event);
        await amplifyBackendService.validateToken();
        console.log(`verified challenge code with result: ${event.response.answerCorrect}`);
        context.done(null, event);
        return event;
    }
    catch (e) {
        console.error('exception occured during verify', e);
        event.response.answerCorrect = false;
        context.done(e, event);
    }
};
class AmplifyBackendService {
    constructor(event) {
        const { sessionId, appId } = event.request.clientMetadata;
        const { challengeAnswer } = event.request;
        this.appId = appId;
        this.sessionId = sessionId;
        this.challengeAnswer = challengeAnswer;
        this.event = event;
    }
    async validateToken() {
        this.amplifyBackend = this.initService();
        // 1. Get token
        const tokenResponse = await this.getToken();
        // 2. Validate token
        const challengeCode = tokenResponse.ChallengeCode;
        if (challengeCode && this.challengeAnswer && this.challengeAnswer === challengeCode) {
            this.event.response.answerCorrect = true;
        }
        else {
            this.event.response.answerCorrect = false;
        }
        // 3. Delete token
        await this.deleteToken();
        return this.event.response.answerCorrect;
    }
    initService() {
        const amplifyBackend = process.env.ENDPOINT
            ? new AmplifyBackend({
                endpoint: process.env.ENDPOINT,
            })
            : new AmplifyBackend();
        return amplifyBackend;
    }
    getToken() {
        return this.amplifyBackend
            .getToken({
                AppId: this.appId,
                SessionId: this.sessionId,
            })
            .promise();
    }
    deleteToken() {
        return this.amplifyBackend
            .deleteToken({
                AppId: this.appId,
                SessionId: this.sessionId,
            })
            .promise();
    }
}
exports.AmplifyBackendService = AmplifyBackendService;
