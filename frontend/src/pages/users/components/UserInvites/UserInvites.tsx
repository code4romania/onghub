import React from 'react';
import { useTranslation } from 'react-i18next';

const UserInvites = () => {
  const { t } = useTranslation('user');
  return <p>{t('invites.title')}</p>;
};

export default UserInvites;
