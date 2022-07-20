import { Injectable } from '@nestjs/common';
import {
  AdminCreateUserCommand,
  AdminDisableUserCommand,
  CognitoIdentityProviderClient,
  DeliveryMediumType,
} from '@aws-sdk/client-cognito-identity-provider';
import { AuthConfig } from './auth.config';

@Injectable()
export class AuthService {
  cognitoProvider: CognitoIdentityProviderClient;
  constructor(private authConfig: AuthConfig) {
    this.cognitoProvider = new CognitoIdentityProviderClient({
      region: this.authConfig.region,
    });
  }

  async createUser(fullName: string, email: string, phoneNumber: string) {
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: this.authConfig.userPoolId,
      Username: email,
      DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
      UserAttributes: [
        {
          Name: 'phone_number',
          Value: phoneNumber,
        },
        {
          Name: 'name',
          Value: fullName,
        },
      ],
    });

    try {
      const data = await this.cognitoProvider.send(createUserCommand);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async disableUser(username: string) {
    const disableUserCommand = new AdminDisableUserCommand({
      UserPoolId: this.authConfig.userPoolId,
      Username: username,
    });

    try {
      const data = await this.cognitoProvider.send(disableUserCommand);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
