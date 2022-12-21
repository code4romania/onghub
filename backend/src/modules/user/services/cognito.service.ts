import { Injectable } from '@nestjs/common';
import {
  AdminCreateUserCommand,
  AdminCreateUserCommandOutput,
  AdminDeleteUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandOutput,
  AdminUserGlobalSignOutCommand,
  CognitoIdentityProviderClient,
  DeliveryMediumType,
  MessageActionType,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoConfig } from 'src/common/config/cognito.config';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

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
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
    });

    const data: AdminCreateUserCommandOutput = await this.cognitoProvider.send(
      createUserCommand,
    );
    return data.User.Username;
  }

  async resendInvite(email: string): Promise<void> {
    const resendUserInvite = new AdminCreateUserCommand({
      UserPoolId: CognitoConfig.userPoolId,
      Username: email,
      DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
      MessageAction: MessageActionType.RESEND,
    });

    await this.cognitoProvider.send(resendUserInvite);

    return;
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
