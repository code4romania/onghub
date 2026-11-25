import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';

const makeService = () => {
  const userRepository = {
    remove: jest.fn().mockResolvedValue([]),
    get: jest.fn(),
  };
  const cognitoService = {
    deleteUser: jest.fn().mockResolvedValue(undefined),
    resendInvite: jest.fn().mockResolvedValue(undefined),
  };
  const userOngApplicationService = { remove: jest.fn().mockResolvedValue([]) };
  const service = new UserService(
    userRepository as any,
    {} as any,
    cognitoService as any,
    {} as any,
    userOngApplicationService as any,
    { enabled: false } as any, // UserLoginLifecycle: Cognito path
  );
  return { service, userRepository, cognitoService, userOngApplicationService };
};

const user = (over: Partial<User> = {}) =>
  ({
    id: 7,
    role: Role.EMPLOYEE,
    organizationId: 3,
    email: 'a@b.ro',
    cognitoId: null,
    ...over,
  }) as User;

describe('UserService.remove', () => {
  it('deletes by id, never by cognitoId (null cognitoId used to match every user)', async () => {
    const { service, userRepository, userOngApplicationService } =
      makeService();

    await service.remove(user({ cognitoId: null }));

    expect(userRepository.remove).toHaveBeenCalledWith({ where: { id: 7 } });
    expect(userOngApplicationService.remove).toHaveBeenCalledWith({
      where: { userId: 7 },
    });
  });

  it('refuses to delete when the id is missing', async () => {
    const { service, userRepository, userOngApplicationService } =
      makeService();

    await expect(service.remove(user({ id: undefined }))).rejects.toThrow();

    expect(userRepository.remove).not.toHaveBeenCalled();
    expect(userOngApplicationService.remove).not.toHaveBeenCalled();
  });
});

describe('UserService.resendUserInvite', () => {
  it('does not resend to a user from another organization', async () => {
    const { service, userRepository, cognitoService } = makeService();
    userRepository.get.mockResolvedValue(user({ organizationId: 99 }));

    await expect(service.resendUserInvite(7, 3)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(cognitoService.resendInvite).not.toHaveBeenCalled();
  });

  it('resends inside the own organization', async () => {
    const { service, userRepository, cognitoService } = makeService();
    userRepository.get.mockResolvedValue(user({ organizationId: 3 }));

    await service.resendUserInvite(7, 3);
    expect(cognitoService.resendInvite).toHaveBeenCalledWith('a@b.ro');
  });
});
