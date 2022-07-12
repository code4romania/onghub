import create from 'zustand';
import { OrganizationGeneral } from '../pages/organization/interfaces/OrganizationGeneral.interface';
import { organizationGeneralSlice } from './organization-general.slice';

interface OrganizationState {
  organizationGeneral: OrganizationGeneral | null;
  setOrganizationGeneral: (organizationGeneral: OrganizationGeneral) => void;
}

const useStore = create<OrganizationState>()((set) => ({
  ...organizationGeneralSlice(set),
}));

export default useStore;
