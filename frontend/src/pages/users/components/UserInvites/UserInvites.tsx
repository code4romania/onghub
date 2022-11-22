import React, { useEffect, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import DataTableFilters from '../../../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../../components/popover-menu/PopoverMenu';
import DateRangePicker from '../../../../components/date-range-picker/DateRangePicker';
import {
  useInviteesQuery,
  useRemoveUserMutation,
  useResendInviteMutation,
} from '../../../../services/user/User.queries';
import { useUser } from '../../../../store/selectors';
import { UserInvitesTableHeaders } from './table-headers/UserInvitesTable.headers';
import { useTranslation } from 'react-i18next';
import { ReplyIcon, TrashIcon } from '@heroicons/react/outline';
import { useErrorToast, useSuccessToast } from '../../../../common/hooks/useToast';
import ConfirmationModal from '../../../../components/confim-removal-modal/ConfirmationModal';
import { IInvite } from '../../interfaces/Invite.interface';

const UserInvites = () => {
  const [isConfirmRemoveModalOpen, setIsConfirmRemoveModalOpen] = useState<boolean>(false);
  const [selectedInviteeForDeletion, setSelectedInviteeForDeletion] = useState<IInvite | null>(
    null,
  );
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [range, setRange] = useState<Date[]>([]);

  const { invites } = useUser();

  const { t } = useTranslation(['user', 'common']);

  const { isLoading, error, refetch } = useInviteesQuery(searchWord as string, range);
  const removeUserMutation = useRemoveUserMutation();
  const resendInviteMutation = useResendInviteMutation();

  useEffect(() => {
    if (error) useErrorToast(t('invites.load_error'));

    if (resendInviteMutation.error) useErrorToast(t('invites.resend_error'));

    if (removeUserMutation.error) useErrorToast(t('invites.remove_error'));
  }, [error, resendInviteMutation.error, removeUserMutation.error]);

  useEffect(() => {
    if (selectedInviteeForDeletion) setIsConfirmRemoveModalOpen(true);
  }, [selectedInviteeForDeletion]);

  const buildUserActionColumn = (): TableColumn<IInvite> => {
    const pendingUserMenuItems = [
      {
        name: t('invites.resend'),
        icon: ReplyIcon,
        onClick: onResendInvite,
      },
      {
        name: t('delete', { ns: 'common' }),
        icon: TrashIcon,
        onClick: setSelectedInviteeForDeletion,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: IInvite) => <PopoverMenu row={row} menuItems={pendingUserMenuItems} />,
      width: '50px',
      allowOverflow: true,
    };
  };

  /**
   * ROW ACTIONS
   */
  const onDelete = () => {
    if (selectedInviteeForDeletion) {
      removeUserMutation.mutate(selectedInviteeForDeletion.id, {
        onSuccess: () => {
          useSuccessToast(`${t('invites.remove_success')} ${selectedInviteeForDeletion.name}`);
          refetch();
        },
        onSettled: () => {
          setSelectedInviteeForDeletion(null);
        },
      });
    }
    setIsConfirmRemoveModalOpen(false);
  };

  const onCancelUserRemoval = () => {
    setIsConfirmRemoveModalOpen(false);
    setSelectedInviteeForDeletion(null);
  };

  const onResendInvite = (row: IInvite) => {
    resendInviteMutation.mutate(row.id, {
      onSuccess: () => {
        useSuccessToast(t('invites.resend_success'));
        refetch();
      },
    });
  };

  /**
   * FILTERS
   */
  const onSearch = (searchWord: string) => {
    setSearchWord(searchWord);
  };

  const onDateChange = (interval: unknown[]) => {
    if (interval[0] && interval[1]) {
      setRange(interval as Date[]);
    }
  };

  const onResetFilters = () => {
    setRange([]);
    setSearchWord(null);
  };

  return (
    <div>
      <DataTableFilters
        onSearch={onSearch}
        searchValue={searchWord}
        onResetFilters={onResetFilters}
      >
        <div className="flex gap-x-6">
          <div className="sm:basis-1/4 w-full">
            <DateRangePicker
              label={t('list.date')}
              value={range.length > 0 ? range : undefined}
              onChange={onDateChange}
            />
          </div>
        </div>
      </DataTableFilters>
      <div className="w-full bg-white shadow rounded-lg my-6">
        <div className="py-5 lg:px-10 px-5 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold sm:text-lg lg:text-xl text-md">
            {t('invites.title')}
          </p>
          {/* Uncomment once download will be implemented */}
          {/* <button type="button" className="edit-button">
            Descarca Tabel
          </button> */}
        </div>
        <div className="pb-2">
          <DataTableComponent
            columns={[...UserInvitesTableHeaders, buildUserActionColumn()]}
            data={invites}
            loading={isLoading}
          />
        </div>
        {isConfirmRemoveModalOpen && (
          <ConfirmationModal
            title={t('invites.confirmation')}
            description={t('invites.description')}
            closeBtnLabel={t('back', { ns: 'common' })}
            confirmBtnLabel={t('delete', { ns: 'common' })}
            onClose={onCancelUserRemoval}
            onConfirm={onDelete}
          />
        )}
      </div>
    </div>
  );
};

export default UserInvites;
