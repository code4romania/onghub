import { IUser } from '../../pages/users/interfaces/User.interface';

export const userSlice = (set: any) => ({
  user: null,
  setUser: (user: IUser | null) => {
    set({ user });
  },
});

export default { userSlice };
