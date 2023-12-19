import useStore from '../store';

export const useUser = () => {
  const profile = useStore((state) => state.profile);
  const users = useStore((state) => state.users);
  const invites = useStore((state) => state.invites);
  return { profile, users, invites };
};
