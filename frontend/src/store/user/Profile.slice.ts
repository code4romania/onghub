import { IUser } from '../../pages/users/interfaces/User.interface';

export const profileSlice = (set: any) => ({
  profile: null,
  setProfile: (profile: IUser | null) => {
    set({ profile });
  },
});

export default { profileSlice };
