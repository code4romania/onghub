import { AdminUserController } from './admin-user.controller';
import { Role } from './enums/role.enum';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

const body = {
  email: 'x@y.ro',
  name: 'Ion Popescu',
  phone: null,
  organizationId: 999,
} as CreateUserDto;

const makeController = () => {
  const userService = {
    createEmployee: jest.fn().mockResolvedValue({}),
    resendUserInvite: jest.fn().mockResolvedValue(undefined),
  };
  return {
    controller: new AdminUserController(userService as any, {} as any),
    userService,
  };
};

describe('AdminUserController', () => {
  it('admin creates employees only in their own organization, ignoring body.organizationId', async () => {
    const { controller, userService } = makeController();
    await controller.create(body, {
      role: Role.ADMIN,
      organizationId: 3,
    } as User);
    expect(userService.createEmployee).toHaveBeenCalledWith(
      expect.objectContaining({ organizationId: 3 }),
    );
  });

  it('super-admin may target another organization', async () => {
    const { controller, userService } = makeController();
    await controller.create(body, {
      role: Role.SUPER_ADMIN,
      organizationId: null,
    } as User);
    expect(userService.createEmployee).toHaveBeenCalledWith(
      expect.objectContaining({ organizationId: 999 }),
    );
  });

  it('resend-invite is scoped to the caller organization', async () => {
    const { controller, userService } = makeController();
    await controller.resendInvite(7, {
      role: Role.ADMIN,
      organizationId: 3,
    } as User);
    expect(userService.resendUserInvite).toHaveBeenCalledWith(7, 3);
  });
});
