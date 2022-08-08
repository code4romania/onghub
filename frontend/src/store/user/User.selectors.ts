import useStore from '../store';

export const useUser = () => {
  const profile = useStore((state) => state.profile);
  const users = useStore((state) => state.users);
  return { profile, users };
};
