import { City } from '../../common/interfaces/city.interface';
import { County } from '../../common/interfaces/county.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nomenclatureSlice = (set: any) => ({
  counties: [],
  cities: [],
  setCounties: (counties: County[]) => {
    set({ counties });
  },
  setCities: (cities: City[]) => {
    set({ cities });
  },
});

export default { nomenclatureSlice };
