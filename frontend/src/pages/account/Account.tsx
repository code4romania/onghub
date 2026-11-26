import React, { useEffect, useState } from 'react';
import { useErrorToast } from '../../common/hooks/useToast';
import { useProfileQuery, useUserMutation } from '../../services/user/User.queries';
import { useAuthContext } from '../../contexts/AuthContext';
import { useUser } from '../../store/user/User.selectors';
import ConfirmationModal from '../../components/confim-removal-modal/ConfirmationModal';
import { useTranslation } from 'react-i18next';
import { UserRole } from '../users/enums/UserRole.enum';

// No password section: NGO Hub logs in with an emailed link or code.
const Account = () => {
  const { logout } = useAuthContext();
  // refetching the profile here validates that the user has access to it's data (is not restricted)
  useProfileQuery();

  const [isAccountDeleteModalOpen, setAccountDeleteModal] = useState(false);
  const { mutateAsync: deleteUser, error: deleteUserError } = useUserMutation();
  const { profile } = useUser();
  const { t } = useTranslation(['account', 'common']);
  const { role } = useAuthContext();

  useEffect(() => {
    useErrorToast((deleteUserError as any)?.response?.data?.message);
  }, [deleteUserError]);

  const handleUserDelete = async () => {
    setAccountDeleteModal(false);
    await deleteUser();
    logout();
  };

  return (
    <>
      <div className="flex items-start justify-between pt-1 pr-1 pb-6">
        <div className="flex flex-col">
          <p className="text-gray-800 font-titilliumBold sm:text-2xl lg:text-3xl text-lg">
            {t('my_account')}
          </p>
          <p className="text-gray-400 sm:pt-6 pt-3 sm:text-sm lg:text-base text-xs">
            {t('account_description')}
          </p>
        </div>
        {role === UserRole.EMPLOYEE && (
          <button
            aria-label={t('close.account')}
            type="button"
            className="red-button"
            onClick={() => {
              setAccountDeleteModal(true);
            }}
          >
            {t('close.account')}
          </button>
        )}
      </div>
      <div className="w-full bg-white shadow rounded-lg">
        <div className="py-5 lg:px-10 px-5 flex justify-between align-center">
          <span className="font-titilliumBold sm:text-lg lg:text-xl text-md text-gray-800 flex items-center">
            {t('settings')}
          </span>
        </div>

        <div className="w-full border-t border-gray-300" />
        <div className="p-5 lg:p-10 flex flex-col">
          <span className="sm:text-sm lg:text-base text-xs">{t('settings_description')}</span>
          <div className="flex flex-col gap-4 pt-4">
            <div className="flex flex-col gap-2">
              <span className="text-gray-700 sm:text-sm lg:text-base text-xs">{t('name')}</span>
              <span className="text-gray-800 font-titilliumBold sm:text-sm lg:text-base text-xs">
                {profile?.name}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-700 sm:text-sm lg:text-base text-xs">{t('email')}</span>
              <span className="text-gray-800 font-titilliumBold sm:text-sm lg:text-base text-xs">
                {profile?.email}{' '}
              </span>
            </div>
          </div>
        </div>
      </div>
      {isAccountDeleteModalOpen && (
        <ConfirmationModal
          title={t('close.title')}
          description={t('close.description')}
          closeBtnLabel={t('back', { ns: 'common' })}
          confirmBtnLabel={t('close.account')}
          onClose={() => {
            setAccountDeleteModal(false);
          }}
          onConfirm={handleUserDelete}
        />
      )}
    </>
  );
};

export default Account;
