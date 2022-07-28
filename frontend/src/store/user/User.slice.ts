export const userSlice = (set: any) => ({
  user: {},

  setUser: (user: any) => {
    set({ user });
  },
});

export default { userSlice };
