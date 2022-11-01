import useStore from '../store';

export const useCivicCenterService = () => {
  const feedbacks = useStore((state) => state.feedbacks);
  return { feedbacks };
};
