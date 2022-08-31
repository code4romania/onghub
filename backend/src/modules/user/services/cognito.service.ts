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

  async createUser({
    name,
    email,
    phone,
  }: Partial<CreateUserDto>): Promise<string> {
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
