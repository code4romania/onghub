import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthConfig } from './auth.config';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor(private readonly authConfig: AuthConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  registerUser(registerRequest: {
    name: string;
    email: string;
    password: string;
  }) {
    const { name, email, password } = registerRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        name,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (error, result) => {
          if (!result) {
            reject(error);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  authenticateUser(user: { name: string; password: string }) {
    const { name, password } = user;

    const authenticationDetails = new AuthenticationDetails({
      Username: name,
      Password: password,
    });
    const userData = {
      Username: name,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: async (result, userConfirmationNecessary) => {
          console.log('userConfirmationNecessary', userConfirmationNecessary);
          const userData = await this.getUserData(newUser);
          resolve(result);
        },
        onFailure: (err) => {
          console.log(err);
          reject(err);
        },
        newPasswordRequired: async (userAttributes, requiredAttributes) => {
          console.log('userAttributes', userAttributes);
          console.log('requiredAttributes', requiredAttributes);
          const newPass = await this.handleNewPasswordRequired(
            newUser,
            'Testpassword123#',
            requiredAttributes,
          );
          resolve(newPass);
        },
      });
    });
  }

  handleNewPasswordRequired(
    cognitoUser: CognitoUser,
    newPassword,
    requiredAttributes,
  ) {
    return new Promise((resolve, reject) => {
      cognitoUser.completeNewPasswordChallenge(
        newPassword,
        requiredAttributes,
        {
          onSuccess: (result, userConfirmationNecessary) => {
            console.log('userConfirmationNecessary', userConfirmationNecessary);
            resolve(result);
          },
          onFailure: (err) => {
            console.log(err);
            reject(err);
          },
        },
      );
    });
  }

  getUserData(cognitoUser) {
    // console.log('username', username);

    // const userData = {
    //   Username: username,
    //   Pool: this.userPool,
    // };

    // const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.getUserData(
        (err, userData) => {
          if (err) {
            console.log(err.message || JSON.stringify(err));
            reject(err.message || JSON.stringify(err));
          }
          console.log(userData);
          resolve(userData);
        },
        { bypassCache: true },
      );
    });
  }
}
