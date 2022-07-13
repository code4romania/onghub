import create from 'zustand';
import { City } from '../common/interfaces/city.interface';
import { County } from '../common/interfaces/county.interface';
import { OrganizationGeneral } from '../pages/organization/interfaces/OrganizationGeneral.interface';
import { nomenclatureSlice } from './nomenclature/nomenclature.slice';
import { organizationGeneralSlice } from './organization/organization-general.slice';

interface OrganizationState {
  organizationGeneral: OrganizationGeneral | null;
  setOrganizationGeneral: (organizationGeneral: OrganizationGeneral) => void;
}
interface NomenclatureState {
  counties: County[];
  cities: City[];
  setCounties: (counties: County[]) => void;
  setCities: (cities: City[]) => void;
}

const useStore = create<OrganizationState & NomenclatureState>()((set) => ({
  ...organizationGeneralSlice(set),
  ...nomenclatureSlice(set),
}));

export default useStore;
