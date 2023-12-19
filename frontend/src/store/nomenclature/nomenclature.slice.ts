import { City } from '../../common/interfaces/city.interface';
import { Coalition } from '../../common/interfaces/coalitions.interface';
import { County } from '../../common/interfaces/county.interface';
import { Domain } from '../../common/interfaces/domain.interface';
import { Faculty } from '../../common/interfaces/faculty.interface';
import { Federation } from '../../common/interfaces/federations.interface';
import { Region } from '../../common/interfaces/region.interface';
import { Skill } from '../../common/interfaces/skill.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nomenclatureSlice = (set: any) => ({
  counties: [],
  cities: [],
  domains: [],
  regions: [],
  federations: [],
  coalitions: [],
  skills: [],
  faculties: [],
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
  setSkills: (skills: Skill[]) => {
    set({ skills });
  },
  setFaculties: (faculties: Faculty[]) => {
    set({ faculties });
  },
});

export default { nomenclatureSlice };
