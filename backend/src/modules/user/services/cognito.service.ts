import { Injectable } from '@nestjs/common';
import {
  AdminCreateUserCommand,
  AdminCreateUserCommandOutput,
  AdminDisableUserCommand,
  AdminUserGlobalSignOutCommand,
  CognitoIdentityProviderClient,
  DeliveryMediumType,
  RevokeTokenCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoConfig } from 'src/common/config/cognito.config';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  USER_ERROR_MESSAGES,
  USER_ERROR_CODES,
} from '../constants/user-error.constants';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class CognitoUserService {
  cognitoProvider: CognitoIdentityProviderClient;
  constructor(private readonly pinoLogger: PinoLogger) {
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
      this.pinoLogger.error({
        error: { error },
        message: USER_ERROR_MESSAGES.CREATE,
        errorCode: USER_ERROR_CODES.USR_002,
      });
    }
  }

  async disableUser(username: string) {
    const disableUserCommand = new AdminDisableUserCommand({
      UserPoolId: CognitoConfig.userPoolId,
      Username: username,
    });

    try {
      const data = await this.cognitoProvider.send(disableUserCommand);
      return data;
    } catch (error) {
      this.pinoLogger.error({
        error: { error },
        message: USER_ERROR_MESSAGES.USER,
        errorCode: USER_ERROR_CODES.USR_001,
      });
    }
  }

  async globalSignOut(username: string) {
    const revokeTokenCommand = new AdminUserGlobalSignOutCommand({
      UserPoolId: CognitoConfig.userPoolId,
      Username: username,
    });

    try {
      const data = await this.cognitoProvider.send(revokeTokenCommand);
      return data;
    } catch (error) {
      this.pinoLogger.error({
        error: { error },
        message: USER_ERROR_MESSAGES.USER,
        errorCode: USER_ERROR_CODES.USR_001,
      });
    }
  }
}
