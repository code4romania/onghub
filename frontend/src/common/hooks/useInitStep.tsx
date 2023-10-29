import { useEffect } from 'react';
import { CREATE_LOCAL_STORAGE_KEY } from '../../pages/create-organziation/constants/CreateOrganization.constant';

export const useInitStep = (setOrganization: any) =>
  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem(CREATE_LOCAL_STORAGE_KEY) || '{}');
    setOrganization(localStorageData);
  }, []);
