import {
  ApplicationWithOngStatus,
  ApplicationWithOngStatusDetails,
} from '../../services/application/interfaces/Application.interface';

export const ongApplicationSlice = (set: any) => ({
  ongApplications: [],
  selectedOngApplication: null,
  setOngApplications: (ongApplications: ApplicationWithOngStatus[]) => {
    set({ ongApplications });
  },
  setSelectedOngApplication: (selectedOngApplication: ApplicationWithOngStatusDetails) => {
    set({ selectedOngApplication });
  },
});

export default { ongApplicationSlice };
