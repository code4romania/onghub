import { CREATE_LOCAL_STORAGE_ACTIVE_STEP_KEY } from '../../pages/create-organziation/constants/CreateOrganization.constant';

export const triggerDownload = (url: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download;
  document.body.appendChild(link);
  link.click();
  link?.parentNode?.removeChild(link);
};

export const updateActiveStepIndexInLocalStorage = (
  activeStepIndex: number,
  value: number,
  setActiveStepIndex: React.Dispatch<React.SetStateAction<number>>,
) => {
  if (activeStepIndex < value)
    localStorage.setItem(
      CREATE_LOCAL_STORAGE_ACTIVE_STEP_KEY,
      JSON.stringify({ activeStepIndex: value }),
    );
  setActiveStepIndex(value);
};
