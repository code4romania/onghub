"use strict";

const SimpleHMACAuth = require('simple-hmac-auth');


const client = new SimpleHMACAuth.Client(process.env.onghub_hmac_api_key, process.env.onghub_hmac_secret_key, {
    host: process.env.onghub_api_url,
    ssl: true,
    verbose: true
});

const options = {
    method: 'POST',
    path: '/api/' + process.env.onghub_api_check_access_endpoint,
    data: undefined
};

exports.handler = async (event) => {

    if (event.request.userNotFound) {
        // The user does not exist in Cognito, nothing to do here, will be handled by Cognito
        return event;
    }

    if (event.callerContext.clientId == process.env.onghub_cognito_client_id) {
        // All users have access to ONGHub
        console.log(`User ${event.request.userAttributes.email} can access ONGHUb`);
        return event;
    } else {

        options.data = {
            applicationClientId: event?.callerContext?.clientId,
            userId: event?.userName
        }

        try {
            const response = await client.request(options);
            console.log(`RESPONSE OK:`, response);
            return event;
        } catch (error) {
            console.log(`Received error:`, error);
            if (!error.code) error.code = 'UNK';
            if (!error.message) error.message = 'Unexpected error, please contact the administrator!'
            throw new Error(`[${error.code}] ${error.message}`);
        }
    }

};
