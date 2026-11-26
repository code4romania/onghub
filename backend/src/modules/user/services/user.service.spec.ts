import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';

const makeService = () => {
  const userRepository = {
    remove: jest.fn().mockResolvedValue([]),
    get: jest.fn(),
  };
  const userLogin = {
    revokeAccess: jest.fn().mockResolvedValue(undefined),
    resendInvite: jest.fn().mockResolvedValue(undefined),
  };
  const userOngApplicationService = { remove: jest.fn().mockResolvedValue([]) };
  const service = new UserService(
    userRepository as any,
    {} as any,
    {} as any,
    userOngApplicationService as any,
    userLogin as any,
  );
  return { service, userRepository, userLogin, userOngApplicationService };
};

const user = (over: Partial<User> = {}) =>
  ({
    id: 7,
    role: Role.EMPLOYEE,
    organizationId: 3,
    email: 'a@b.ro',
    ...over,
  }) as User;

describe('UserService.remove', () => {
  it('deletes by id (a missing key in where used to match every user)', async () => {
    const { service, userRepository, userOngApplicationService } =
      makeService();

    await service.remove(user());

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
    const { service, userRepository, userLogin } = makeService();
    userRepository.get.mockResolvedValue(user({ organizationId: 99 }));

    await expect(service.resendUserInvite(7, 3)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(userLogin.resendInvite).not.toHaveBeenCalled();
  });

  it('resends inside the own organization, to a user who never logged in', async () => {
    const { service, userRepository, userLogin } = makeService();
    const pending = user({ organizationId: 3, status: UserStatus.PENDING });
    userRepository.get.mockResolvedValue(pending);

    await service.resendUserInvite(7, 3);
    expect(userLogin.resendInvite).toHaveBeenCalledWith(pending);
  });

  it("removing also ends the user's sessions", async () => {
    const { service, userLogin } = makeService();
    await service.remove(user());
    expect(userLogin.revokeAccess).toHaveBeenCalledWith([7]);
  });
});
