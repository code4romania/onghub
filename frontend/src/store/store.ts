import { organizationActivitySlice } from './organization/organization-activity.slice';
import create from 'zustand';
import { City } from '../common/interfaces/city.interface';
import { County } from '../common/interfaces/county.interface';
import { IOrganizationFinancial } from '../pages/organization/interfaces/OrganizationFinancial.interface';
import { IOrganizationGeneral } from '../pages/organization/interfaces/OrganizationGeneral.interface';
import { IOrganizationLegal } from '../pages/organization/interfaces/OrganizationLegal.interface';
import { IOrganizationReport } from '../pages/organization/interfaces/OrganizationReport.interface';
import { nomenclatureSlice } from './nomenclature/nomenclature.slice';
import { organizationFinancialSlice } from './organization/organization-financial.slice';
import { organizationGeneralSlice } from './organization/organization-general.slice';
import { Domain } from '../common/interfaces/domain.interface';
import { Region } from '../common/interfaces/region.interface';
import { Coalition } from '../common/interfaces/coalitions.interface';
import { Federation } from '../common/interfaces/federations.interface';
import { organizationLegalSlice } from './organization/organization-legal.slice';
import { organizationReportsSlice } from './organization/organization-reports.slice';
import { userSlice } from './user/User.slice';

interface OrganizationState {
  organizationGeneral: IOrganizationGeneral | null;
  organizationFinancial: IOrganizationFinancial[];
  organizationActivity: any;
  setOrganizationActivity: (organizationActivity: any) => void;
  organizationReport: IOrganizationReport | null;
  organizationLegal: IOrganizationLegal | null;
  setOrganizationGeneral: (organizationGeneral: IOrganizationGeneral) => void;
  setOrganizationFinancial: (organizationFinancial: IOrganizationFinancial[]) => void;
  setOrganizationReport: (organizationReport: IOrganizationReport) => void;
  setOrganizationLegal: (organizationLegal: IOrganizationLegal) => void;
}
interface NomenclatureState {
  counties: County[];
  cities: City[];
  domains: Domain[];
  regions: Region[];
  federations: Federation[];
  coalitions: Coalition[];
  setCounties: (counties: County[]) => void;
  setCities: (cities: City[]) => void;
  setDomains: (domains: Domain[]) => void;
  setRegions: (regions: Region[]) => void;
  setFederations: (federations: Federation[]) => void;
  setCoalitions: (coaltions: Coalition[]) => void;
}

interface UserState {
  user: any;
  setUser: (user: any) => void;
}

const useStore = create<OrganizationState & NomenclatureState & UserState>()((set: any) => ({
  ...organizationGeneralSlice(set),
  ...organizationFinancialSlice(set),
  ...organizationActivitySlice(set),
  ...organizationReportsSlice(set),
  ...organizationLegalSlice(set),
  ...nomenclatureSlice(set),
  ...userSlice(set),
}));

export default useStore;
