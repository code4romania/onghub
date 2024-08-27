import { UseMutateFunction } from 'react-query';
import { OrganizationPayload } from '../../../services/organization/Organization.queries';
import { IOrganizationActivity } from './OrganizationActivity.interface';
import { IOrganizationFinancial } from './OrganizationFinancial.interface';
import { IOrganizationGeneral } from './OrganizationGeneral.interface';
import { IOrganizationLegal } from './OrganizationLegal.interface';
import { IOrganizationReport } from './OrganizationReport.interface';

export interface OrganizationContext {
  disabled: boolean;
  isLoading: boolean;
  updateOrganization: UseMutateFunction<
    | IOrganizationGeneral
    | IOrganizationActivity
    | IOrganizationFinancial
    | IOrganizationLegal
    | IOrganizationReport,
    unknown,
    OrganizationPayload,
    unknown
  >;
}
