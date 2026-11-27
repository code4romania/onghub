import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ExtractUser } from 'src/modules/user/decorators/user.decorator';
import { Role } from 'src/modules/user/enums/role.enum';
import { CreateOidcClientDto } from '../dto/create-oidc-client.dto';
import {
  OidcClientService,
  OidcClientSummary,
} from '../services/oidc-client.service';

/**
 * O15: the OIDC client of an application, on the super admin's application
 * page. One client per application. The secret is returned only by create and
 * rotate, once; NGO Hub keeps it sealed and never shows it again.
 */
@Roles(Role.SUPER_ADMIN)
@Controller('application/:id/oidc-client')
export class OidcClientController {
  constructor(
    private readonly clients: OidcClientService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  async get(
    @Param('id', ParseIntPipe) applicationId: number,
  ): Promise<{ client: OidcClientSummary | null }> {
    await this.assertApplication(applicationId);
    return { client: await this.clients.findByApplication(applicationId) };
  }

  @Post()
  async create(
    @Param('id', ParseIntPipe) applicationId: number,
    @Body() body: CreateOidcClientDto,
    @ExtractUser('id') userId: number,
  ): Promise<{ clientId: string; clientSecret: string }> {
    await this.assertApplication(applicationId);
    if (await this.clients.findByApplication(applicationId)) {
      throw new ConflictException({
        message: 'This application already has an OIDC client',
        errorCode: 'OIDC_CLIENT_EXISTS',
      });
    }
    return this.clients.create({
      ...body,
      applicationId,
      createdById: userId,
    });
  }

  @Post('rotate-secret')
  async rotate(
    @Param('id', ParseIntPipe) applicationId: number,
    @ExtractUser('id') userId: number,
  ): Promise<{ clientId: string; clientSecret: string }> {
    const client = await this.clients.findByApplication(applicationId);
    if (!client) {
      throw new NotFoundException({
        message: 'This application has no OIDC client',
        errorCode: 'OIDC_CLIENT_NOT_FOUND',
      });
    }
    const clientSecret = await this.clients.rotateSecret(
      client.clientId,
      userId,
    );
    return { clientId: client.clientId, clientSecret };
  }

  private async assertApplication(applicationId: number): Promise<void> {
    const [found] = await this.dataSource.query(
      `SELECT 1 FROM application WHERE id = $1 AND deleted_on IS NULL`,
      [applicationId],
    );
    if (!found) {
      throw new NotFoundException({
        message: 'Application not found',
        errorCode: 'OIDC_APPLICATION_NOT_FOUND',
      });
    }
  }
}
