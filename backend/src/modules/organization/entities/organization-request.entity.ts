import { Column, Entity } from 'typeorm';
import { Request } from '../../../shared/entities/request.entity';

@Entity({ name: 'organization_request' })
export class OrganizationRequest extends Request {
  // ADMIN ACCOUNT DETAILS
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Column({ type: 'varchar', name: 'phone' })
  phone: string;

  @Column({ type: 'varchar', name: 'organization_name' })
  organizationName: string;
}
