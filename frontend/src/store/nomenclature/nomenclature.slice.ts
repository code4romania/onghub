import { City } from '../../common/interfaces/city.interface';
import { Coalition } from '../../common/interfaces/coalitions.interface';
import { County } from '../../common/interfaces/county.interface';
import { Domain } from '../../common/interfaces/domain.interface';
import { Federation } from '../../common/interfaces/federations.interface';
import { Region } from '../../common/interfaces/region.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nomenclatureSlice = (set: any) => ({
  counties: [],
  cities: [],
  domains: [],
  regions: [],
  federations: [],
  coalitions: [],
  setCounties: (counties: County[]) => {
    set({ counties });
  },
  setCities: (cities: City[]) => {
    set({ cities });
  },
  setDomains: (domains: Domain[]) => {
    set({ domains });
  },
  setRegions: (regions: Region[]) => {
    set({ regions });
  },
  setFederations: (federations: Federation[]) => {
    set({ federations });
  },
  setCoalitions: (coalitions: Coalition[]) => {
    set({ coalitions });
  },
});

export default { nomenclatureSlice };
