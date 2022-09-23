import React, { useEffect, useState } from 'react';
import { SortOrder, TableColumn } from 'react-data-table-component';
import DataTableFilters from '../../../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../../components/popover-menu/PopoverMenu';
import DateRangePicker from '../../../../components/date-range-picker/DateRangePicker';
import {
  useCognitoUsersQuery,
  useRemoveUserMutation,
} from '../../../../services/user/User.queries';
import { useUser } from '../../../../store/selectors';
import { UserInvitesTableHeaders } from './table-headers/UserInvitesTable.headers';
import { useTranslation } from 'react-i18next';
import { ReplyIcon, TrashIcon } from '@heroicons/react/outline';
import { useErrorToast, useSuccessToast } from '../../../../common/hooks/useToast';
import ConfirmationModal from '../../../../components/confim-removal-modal/ConfirmationModal';
import { IInvite } from '../../interfaces/Invite.interface';
import { OrderDirection } from '../../../../common/enums/sort-direction.enum';

const UserInvites = () => {
  const [isConfirmRemoveModalOpen, setIsConfirmRemoveModalOpen] = useState<boolean>(false);
  const [selectedInvite, setSelectedInvite] = useState<IInvite | null>(null);
  const [orderByColumn, setOrderByColumn] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<OrderDirection>();
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [range, setRange] = useState<Date[]>([]);

  const { invites } = useUser();

  const { t } = useTranslation(['user', 'common']);

  const { isLoading, error, refetch } = useCognitoUsersQuery(
    orderByColumn as string,
    orderDirection as OrderDirection,
    searchWord as string,
    range,
  );

  useEffect(() => {
    if (error) useErrorToast(t('list.load_error'));
  }, [error]);

  useEffect(() => {
    if (selectedInvite) setIsConfirmRemoveModalOpen(true);
  }, [selectedInvite]);

  const removeUserMutation = useRemoveUserMutation();

  const buildUserActionColumn = (): TableColumn<IInvite> => {
    const pendingUserMenuItems = [
      {
        name: t('edit', { ns: 'common' }),
        icon: ReplyIcon,
        onClick: setSelectedInvite,
      },
      {
        name: t('delete', { ns: 'common' }),
        icon: TrashIcon,
        onClick: setSelectedInvite,
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
    if (selectedInvite) {
      removeUserMutation.mutate(selectedInvite.id, {
        onSuccess: () => {
          useSuccessToast(`${t('list.remove_success')} ${selectedInvite.name}`);
          refetch();
        },
        onSettled: () => {
          setSelectedInvite(null);
        },
      });
    }
    setIsConfirmRemoveModalOpen(false);
  };

  const onCancelUserRemoval = () => {
    setIsConfirmRemoveModalOpen(false);
    setSelectedInvite(null);
  };

  /**
   * FILTERS
   */
  const onSort = (column: TableColumn<string>, direction: SortOrder) => {
    setOrderByColumn(column.id as string);
    setOrderDirection(
      direction.toLocaleUpperCase() === OrderDirection.ASC
        ? OrderDirection.ASC
        : OrderDirection.DESC,
    );
  };

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
          <div className="basis-1/4">
            <DateRangePicker
              label={t('list.date')}
              defaultValue={range.length > 0 ? range : undefined}
              onChange={onDateChange}
            />
          </div>
        </div>
      </DataTableFilters>
      <div className="w-full bg-white shadow rounded-lg my-6">
        <div className="py-5 px-10 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold text-xl">{t('title')}</p>
          {/* Uncomment once download will be implemented */}
          {/* <button type="button" className="edit-button">
            Descarca Tabel
          </button> */}
        </div>
        <div className="pb-5 px-10">
          <DataTableComponent
            columns={[...UserInvitesTableHeaders, buildUserActionColumn()]}
            data={invites}
            loading={isLoading}
            onSort={onSort}
          />
        </div>
        {isConfirmRemoveModalOpen && (
          <ConfirmationModal
            title={t('list.confirmation')}
            description={t('list.description')}
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
