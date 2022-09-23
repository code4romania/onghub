import { ConsoleLogger, Injectable } from '@nestjs/common';
import {
  AdminCreateUserCommand,
  AdminCreateUserCommandOutput,
  AdminDeleteUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandOutput,
  AdminUserGlobalSignOutCommand,
  CognitoIdentityProviderClient,
  DeliveryMediumType,
  ListUsersCommand,
  ListUsersCommandOutput,
  MessageActionType,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoConfig } from 'src/common/config/cognito.config';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CognitoUserStatus } from '../enums/cognito-user-status.enum';

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

    const data: AdminCreateUserCommandOutput = await this.cognitoProvider.send(
      createUserCommand,
    );
    return data.User.Username;
  }

  async getCognitoUsers(status: CognitoUserStatus) {
    const listUsersCommand = new ListUsersCommand({
      UserPoolId: CognitoConfig.userPoolId,
      Filter: `cognito:user_status = "${status}"`,
    });

    const data: ListUsersCommandOutput = await this.cognitoProvider.send(
      listUsersCommand,
    );

    return data.Users;
  }

  async resendInvite(email: string): Promise<void> {
    console.log(email);
    const resendUserInvite = new AdminCreateUserCommand({
      UserPoolId: CognitoConfig.userPoolId,
      Username: email,
      DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
      MessageAction: MessageActionType.RESEND,
    });

    const data: AdminCreateUserCommandOutput = await this.cognitoProvider.send(
      resendUserInvite,
    );
  }

  async updateUser(email: string, { name, phone }: UpdateUserDto) {
    const updateUserAttributesCommand = new AdminUpdateUserAttributesCommand({
      UserPoolId: CognitoConfig.userPoolId,
      Username: email,
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

    const data: AdminUpdateUserAttributesCommandOutput =
      await this.cognitoProvider.send(updateUserAttributesCommand);

    return data;
  }

  async globalSignOut(cognitoId: string) {
    const revokeTokenCommand = new AdminUserGlobalSignOutCommand({
      UserPoolId: CognitoConfig.userPoolId,
      Username: cognitoId,
    });

    const data = await this.cognitoProvider.send(revokeTokenCommand);
    return data;
  }

  async deleteUser(cognitoId: string) {
    const deleteUserCommand = new AdminDeleteUserCommand({
      UserPoolId: CognitoConfig.userPoolId,
      Username: cognitoId,
    });

    return this.cognitoProvider.send(deleteUserCommand);
  }
}
