import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity } from 'typeorm';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';

@Entity()
export class Application extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({
    type: 'enum',
    enum: ApplicationTypeEnum,
    name: 'type',
  })
  type: ApplicationTypeEnum;

  @Column({ type: 'jsonb', name: 'steps' })
  steps: string[];

  @Column({ type: 'text', name: 'short_description' })
  shortDescription: string;

  @Column({ type: 'text', name: 'description' })
  description: string;

  @Column({ type: 'text', name: 'login_link' })
  loginLink: string;

  @Column({ type: 'text', name: 'video_link' })
  video: string;

  @Column({ type: 'text', name: 'logo' })
  logo: string;
}
