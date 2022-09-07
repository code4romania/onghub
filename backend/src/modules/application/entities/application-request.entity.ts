import { Application } from 'src/modules/application/entities/application.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Request } from '../../../shared/entities/request.entity';

@Entity({ name: 'application_request' })
export class ApplicationRequest extends Request {
  @Column({ type: 'integer', nullable: true, name: 'application_id' })
  applicationId: number;

  @ManyToOne((type) => Application)
  @JoinColumn({ name: 'application_id' })
  application: Application;
}
