"use strict";
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
    const templateInvite = (email, code) => `<div style="margin: 0 auto; width: 600px; background-color: #fff; font-size: 1.2rem; font-style: normal; font-weight: normal; line-height: 19px;" align="center">
<div style="padding: 20;">
  <p style="margin-top: 20px; margin-bottom: 0px; font-size: 16px; line-height: 24px; color: #000000; text-align: left;">Hi!</p>
  <p style="margin-top: 20px; margin-bottom: 0px; font-size: 16px; line-height: 24px; color: #000000; text-align: left;">You are invited to collaborate on the ${sanitizedAppName} (${appId}) project on AWS Amplify.</p>
  <p style="margin-top: 20px; margin-bottom: 0px; font-size: 16px; line-height: 24px; color: #000000; text-align: left;">Your temporary credentials are:</p>
  <p style="margin-top: 0px; margin-bottom: 0px; font-size: 16px; line-height: 24px; color: #000000; text-align: left;"><strong>Username:</strong> <a style="text-decoration: none" href="mailto:${email}">${email}</a></p>
  <p style="margin-top: 0px; margin-bottom: 0px; font-size: 16px; line-height: 24px; color: #000000; text-align: left;"><strong>Temporary Password:</strong> ${code}</p>
  <p style="margin-top: 20px; margin-bottom: 0px; font-size: 16px; line-height: 24px; color: #000000; text-align: left;"><a style="text-decoration: none" href="${inviteLink}">Visit the Amplify Studio</a> to get started!</p>
</div>
</div>
`;
    if (event.triggerSource === 'CustomMessage_AdminCreateUser') {
        event.response = {
            emailSubject: 'Welcome to Amplify Studio | Your temporary account details',
            emailMessage: templateInvite(event.request.usernameParameter, event.request.codeParameter),
        };
    }
    callback(null, event);
    return event;
};
