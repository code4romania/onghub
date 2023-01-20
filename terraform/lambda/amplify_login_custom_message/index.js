"use strict";

const { getForgotPasswordEmailTemplate, getForgotPasswordEmailTitle, getInviteUserEmailTemplate, getInviteUserEmailTitle } = require('./email_template_gen');

exports.handler = async (event, context, callback) => {
  let appName;
  let appId;
  let appLink;
  let region;
  let environment;
  if (event.request.clientMetadata) {
    ({ appId, appName, appLink, region, environment } = event.request.clientMetadata);
  }
  let sanitizedAppName = appName ? appName.replace(/[^a-zA-Z0-9]/g, '') : '';
  if (sanitizedAppName.length < 3) {
    sanitizedAppName = 'amplify';
  }
  const inviteLink = region !== undefined && environment !== undefined
    ? `https://${region}.admin.amplifyapp.com/admin/login?appId=${appId}&backendEnvironmentName=${environment}`
    : appLink;

  if (event.triggerSource === 'CustomMessage_AdminCreateUser') {
    event.response = {
      emailSubject: getInviteUserEmailTitle(),
      emailMessage: getInviteUserEmailTemplate(event.request.usernameParameter, event.request.codeParameter, inviteLink),
    };
  }

  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    event.response = {
      emailSubject: getForgotPasswordEmailTitle(),
      emailMessage: getForgotPasswordEmailTemplate(event.request.codeParameter)
    };
  }

  callback(null, event);
  return event;
};
