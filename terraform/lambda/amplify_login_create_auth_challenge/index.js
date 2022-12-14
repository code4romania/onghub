"use strict";
exports.handler = async (event, context) => {
    event.response.privateChallengeParameters = { secretLoginCode: 'mockedCode' };
    event.response.challengeMetadata = ``;
    console.log('event', event);
    context.done(null, event);
};
