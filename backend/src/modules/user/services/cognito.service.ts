import { Injectable } from '@nestjs/common';
import {
  AdminCreateUserCommand,
  AdminCreateUserCommandOutput,
  AdminDisableUserCommand,
  CognitoIdentityProviderClient,
  DeliveryMediumType,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoConfig } from 'src/common/config/cognito.config';
import { ICreateCognitoUser } from '../models/create-cognito-user.interface';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CognitoUserService {
  cognitoProvider: CognitoIdentityProviderClient;
  constructor() {
    this.cognitoProvider = new CognitoIdentityProviderClient({
      region: CognitoConfig.region,
    });
  }

  async createUser({ name, email, phone }: CreateUserDto): Promise<string> {
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: CognitoConfig.userPoolId,
      Username: email,
      DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
      UserAttributes: [
        {
          Name: 'phone_number',
          Value: phone,
        },
        {
          Name: 'name',
          Value: name,
        },
      ],
    });

    try {
      const data: AdminCreateUserCommandOutput =
        await this.cognitoProvider.send(createUserCommand);
      return data.User.Username;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async disableUser(username: string) {
    const disableUserCommand = new AdminDisableUserCommand({
      UserPoolId: CognitoConfig.userPoolId,
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
