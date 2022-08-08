export const usersSlice = (set: any) => ({
  users: [],
  setUsers: (users: any[]) => {
    set({ users });
  },
});

export default { usersSlice };
