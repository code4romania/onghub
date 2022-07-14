import create from 'zustand';
import { City } from '../common/interfaces/city.interface';
import { County } from '../common/interfaces/county.interface';
import { IOrganizationFinancial } from '../pages/organization/interfaces/OrganizationFinancial.interface';
import { IOrganizationGeneral } from '../pages/organization/interfaces/OrganizationGeneral.interface';
import { nomenclatureSlice } from './nomenclature/nomenclature.slice';
import { organizationFinancialSlice } from './organization/organization-financial.slice';
import { organizationGeneralSlice } from './organization/organization-general.slice';

interface OrganizationState {
  organizationGeneral: IOrganizationGeneral | null;
  organizationFinancial: IOrganizationFinancial[];
  setOrganizationGeneral: (organizationGeneral: IOrganizationGeneral) => void;
  setOrganizationFinancial: (organizationFinancial: IOrganizationFinancial[]) => void;
}
interface NomenclatureState {
  counties: County[];
  cities: City[];
  setCounties: (counties: County[]) => void;
  setCities: (cities: City[]) => void;
}

const useStore = create<OrganizationState & NomenclatureState>()((set: any) => ({
  ...organizationGeneralSlice(set),
  ...organizationFinancialSlice(set),
  ...nomenclatureSlice(set),
}));

export default useStore;
