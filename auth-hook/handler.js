"use strict";

const SimpleHMACAuth = require('simple-hmac-auth');

const appsMap = {
  'ONGHub': 'e62c2ik4h1areh8o49l8rqsht',
  'TEO': '7fltj3s68f97gjigs1c00psfjf'
};

const client = new SimpleHMACAuth.Client('API_KEY_TEST', 'SECRET_TO_BE_ADDED_HERE', {
  host: '41c0-188-27-124-130.ngrok.io',
  // port: 3001,
  ssl: true,
  verbose: true
});

const optionsGET = {
  method: 'GET',
  path: '/api/check',
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
    console.log(`User ${event.request.userAttributes.email} can't access other apps`);
    console.log('Check permissions in backend');

    try {
      const response = await client.request(optionsGET);
      console.log(`RESPONSE OK:`, response);
      return event;
    } catch (error) {
      console.log(`Received error:`, error);
      throw new Error("You are not allowed to access this application. Contact your administrator!");
    }
  }

};
