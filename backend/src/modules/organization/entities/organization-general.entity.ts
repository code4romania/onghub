import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { City } from 'src/shared/entities/city.entity';
import { Contact } from 'src/shared/entities/contact.entity';
import { County } from 'src/shared/entities/county.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { OrganizationType } from '../enums/organization-type.enum';
import { Organization } from './organization.entity';

@Entity()
export class OrganizationGeneral extends BaseEntity {
  @Column({ type: 'text', unique: true, name: 'name' })
  name: string;

  @Column({ type: 'text', name: 'alias' })
  alias: string;

  @Column({ type: 'enum', enum: OrganizationType, name: 'type' })
  type: OrganizationType;

  @Column({ type: 'text', name: 'email' })
  email: string;

  @Column({ type: 'integer', name: 'year_created' })
  yearCreated: number;

  @Column({ type: 'text', name: 'cui', unique: true })
  cui: string;

  @Column({ type: 'text', name: 'raf_number', unique: true })
  rafNumber: string;

  @Column({ type: 'text', name: 'short_description', nullable: true })
  shortDescription: string;

  @Column({ type: 'text', name: 'description', nullable: true })
  description: string;

  // TODO: this needs to be from the attachment table
  @Column({ type: 'text', name: 'logo' })
  logo: string;

  @Column({ type: 'text', name: 'website' })
  website: string;

  @Column({ type: 'text', name: 'facebook', nullable: true })
  facebook: string;

  @Column({ type: 'text', name: 'instagram', nullable: true })
  instagram: string;

  @Column({ type: 'text', name: 'twitter', nullable: true })
  twitter: string;

  @Column({ type: 'text', name: 'linkedin', nullable: true })
  linkedin: string;

  @Column({ type: 'text', name: 'tiktok', nullable: true })
  tiktok: string;

  @Column({ type: 'text', name: 'donation_website', nullable: true })
  donationWebsite: string;

  @Column({ type: 'text', name: 'redirect_link', nullable: true })
  redirectLink: string;

  @Column({ type: 'text', name: 'donation_sms', nullable: true })
  donationSMS: string;

  @Column({ type: 'text', name: 'donation_keyword', nullable: true })
  donationKeyword: string;

  @Exclude()
  @Column({ type: 'integer', nullable: true, name: 'contact_id' })
  contactId: number;

  @OneToOne(() => Contact, { cascade: true })
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;

  @OneToOne(
    () => Organization,
    (organization) => organization.organizationGeneral,
  )
  organization: Organization;

  @Exclude()
  @Column({ type: 'integer', nullable: true, name: 'city_id' })
  cityId: number;

  @ManyToOne((type) => City)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Exclude()
  @Column({ type: 'integer', nullable: true, name: 'county_id' })
  countyId: number;

  @ManyToOne((type) => County)
  @JoinColumn({ name: 'county_id' })
  county: County;
}
