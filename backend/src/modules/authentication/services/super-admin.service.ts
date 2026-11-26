import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/user/enums/role.enum';
import { UserStatus } from 'src/modules/user/enums/user-status.enum';
import { AuthEventService, AuthEventType } from './auth-event.service';
import { UserLoginLifecycle } from './user-login-lifecycle.service';

export interface SuperAdminSummary {
  id: number;
  email: string;
  name: string;
  status: string;
}

/**
 * Super admins without Cognito (plan 5.5): nothing in the app creates them,
 * so `npm run auth:super-admin` does, through this service. A super admin is
 * a user with role super-admin and no organization, invited like anyone else
 * (link + code, 30 days). Every change is written to auth_event.
 */
@Injectable()
export class SuperAdminService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userLogin: UserLoginLifecycle,
    private readonly events: AuthEventService,
  ) {}

  async list(): Promise<SuperAdminSummary[]> {
    return this.dataSource.getRepository(User).find({
      where: { role: Role.SUPER_ADMIN },
      select: { id: true, email: true, name: true, status: true },
      order: { id: 'ASC' },
    });
  }

  async add(input: {
    email: string;
    name: string;
    phone?: string;
  }): Promise<SuperAdminSummary> {
    const email = (input.email ?? '').trim().toLowerCase();
    const name = (input.name ?? '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new Error(`not an email address: ${input.email}`);
    }
    if (!name) throw new Error('a name is required (--name)');

    const users = this.dataSource.getRepository(User);
    const existing = await users
      .createQueryBuilder('user')
      .where('lower(user.email) = :email', { email })
      .getOne();
    if (existing) {
      throw new Error(`${email} already has a user (${existing.role})`);
    }

    // save() (not insert): the user-history subscriber needs the entity.
    const user = await users.save(
      users.create({
        email,
        name,
        phone: input.phone?.trim() || null,
        role: Role.SUPER_ADMIN,
        status: UserStatus.PENDING,
        organizationId: null,
      }),
    );
    await this.events.record({
      type: AuthEventType.SUPER_ADMIN_ADDED,
      userId: user.id,
    });
    await this.userLogin.invite(user);
    return { id: user.id, email, name, status: user.status };
  }

  /** Restricts the super admin and ends every session at once (kept for history, not deleted). */
  async remove(rawEmail: string): Promise<SuperAdminSummary> {
    const email = (rawEmail ?? '').trim().toLowerCase();
    const users = this.dataSource.getRepository(User);
    const user = await users
      .createQueryBuilder('user')
      .where('lower(user.email) = :email', { email })
      .andWhere('user.role = :role', { role: Role.SUPER_ADMIN })
      .getOne();
    if (!user) throw new Error(`no super admin with email ${email}`);

    user.status = UserStatus.RESTRICTED;
    await users.save(user);
    await this.userLogin.revokeAccess([user.id]);
    await this.events.record({
      type: AuthEventType.SUPER_ADMIN_REMOVED,
      userId: user.id,
    });
    return { id: user.id, email, name: user.name, status: user.status };
  }
}
