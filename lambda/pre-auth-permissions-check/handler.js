"use strict";

const SimpleHMACAuth = require('simple-hmac-auth');

const appsMap = {
  'ONGHub': 'e62c2ik4h1areh8o49l8rqsht',
  'TEO': '7fltj3s68f97gjigs1c00psfjf'
};

const client = new SimpleHMACAuth.Client('API_KEY_TEST', 'SECRET_TO_BE_ADDED_HERE', {
  host: 'onghub-api.wearetribus.com', // TODO: add host in .env 
  // port: 3001,
  ssl: true,
  verbose: true
});

const options = {
  method: 'POST',
  path: '/api/hasAccess',
  data: undefined
};

module.exports.permissionCheck = async (event) => {

  if (event.request.userNotFound) {
    // The user does not exist in Cognito, nothing to do here
    return event;
  }

  if (event.callerContext.clientId == appsMap.ONGHub) {
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
      throw error;
    }
  }

};
