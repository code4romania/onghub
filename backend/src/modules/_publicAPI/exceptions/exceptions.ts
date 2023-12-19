import { BusinessException } from 'src/common/interfaces/business-exception';

export enum UserWithOrganizationExceptionCodes {
  USR_ONG_001 = 'USR_ONG_001',
}

type UserWithOrganizationExceptionCodesType =
  keyof typeof UserWithOrganizationExceptionCodes;

// Add messages for the coresponding Internal Exception Code
export const UserWithOrganizationExceptionMessages: Record<
  UserWithOrganizationExceptionCodes,
  BusinessException<UserWithOrganizationExceptionCodesType>
> = {
  [UserWithOrganizationExceptionCodes.USR_ONG_001]: {
    errorCode: UserWithOrganizationExceptionCodes.USR_ONG_001,
    message: 'Error while getting the user and organization data for TEO',
  },
};
