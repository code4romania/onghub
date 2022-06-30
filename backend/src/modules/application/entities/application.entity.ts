import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ApplicationType } from './application-type.entity';

@Entity()
export class Application extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;

  @Exclude()
  @Column({
    type: 'integer',
    nullable: true,
    name: 'application_type_id',
  })
  applicationTypeId: number;

  @OneToOne(
    () => ApplicationType,
    (applicationType) => applicationType.application,
    { cascade: true },
  )
  @JoinColumn({ name: 'application_type_id' })
  type: ApplicationType;

  @Column({ type: 'jsonb', name: 'steps' })
  steps: string[];

  @Column({ type: 'text', name: 'short_description' })
  short_description: string;

  @Column({ type: 'text', name: 'description' })
  description: string;

  @Column({ type: 'text', name: 'login_link' })
  login_link: string;

  @Column({ type: 'text', name: 'video_link' })
  video: string;

  @Column({ type: 'text', name: 'logo' })
  logo: string;
}
