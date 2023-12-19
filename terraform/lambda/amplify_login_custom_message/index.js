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

  const inviteLink = process.env.onghub_frontend_url;

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
