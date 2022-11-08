import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CivicCenterService } from './civic-center-service.entity';

@Entity()
export class Feedback extends BaseEntity {
  @Column({ type: 'varchar', name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', name: 'interaction_date' })
  interactionDate: string;

  @Column({ type: 'varchar', name: 'message' })
  message: string;

  @Column({ type: 'integer', name: 'rating' })
  rating: number;

  @Column({ type: 'integer', name: 'civic_center_service_id' })
  civicCenterServiceId: number;

  @ManyToOne((type) => CivicCenterService)
  @JoinColumn({ name: 'civic_center_service_id' })
  civicCenterService: CivicCenterService;
}
