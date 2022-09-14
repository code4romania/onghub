import { Injectable, Logger } from '@nestjs/common';
import { UserOngApplicationRepository } from '../repositories/user-ong-application.repository';

@Injectable()
export class UserOngApplicationService {
  private readonly logger = new Logger(UserOngApplicationService.name);
  constructor(
    private readonly userOngApplicationRepository: UserOngApplicationRepository,
  ) {}
}
