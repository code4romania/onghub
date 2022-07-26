import useStore from '../store';

export const useUser = () => {
  const user = useStore((state) => state.user);
  return { user };
};
