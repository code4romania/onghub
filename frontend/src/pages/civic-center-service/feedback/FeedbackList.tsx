import { EyeIcon, TrashIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { SortOrder, TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { PaginationConfig } from '../../../common/config/pagination.config';
import { OrderDirection } from '../../../common/enums/sort-direction.enum';
import { formatDate } from '../../../common/helpers/format.helper';
import { useErrorToast, useSuccessToast } from '../../../common/hooks/useToast';
import ConfirmationModal from '../../../components/confim-removal-modal/ConfirmationModal';
import DataTableComponent from '../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../components/popover-menu/PopoverMenu';
import {
  useFeedbackQuerry,
  useRemoveFeedbackMutation,
} from '../../../services/civic-center-service/CivicCenterService.queries';
import { useCivicCenterService } from '../../../store/selectors';
import { IFeedback } from '../interfaces/Feedback.interface';
import FeedbackViewModal from './components/FeedbackViewModal';
import { FeedbackListTableHeaders } from './table-headers/FeedbackListTable.headers';

const FeedbackList = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<IFeedback | null>(null);
  const [page, setPage] = useState<number>();
  const [rowsPerPage, setRowsPerPage] = useState<number>();
  const [orderByColumn, setOrderByColumn] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<OrderDirection>();
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isConfirmRemoveModalOpen, setIsConfirmRemoveModalOpen] = useState<boolean>(false);

  const { feedbacks } = useCivicCenterService();

  const { t } = useTranslation(['feedback', 'common']);

  const { isLoading, error, refetch } = useFeedbackQuerry(
    rowsPerPage as number,
    page as number,
    orderByColumn as string,
    orderDirection as OrderDirection,
  );
  const removeFeedbackMutation = useRemoveFeedbackMutation();

  useEffect(() => {
    if (feedbacks?.meta) {
      setPage(1);
      setRowsPerPage(feedbacks.meta.itemsPerPage);
      setOrderByColumn(feedbacks.meta.orderByColumn);
      setOrderDirection(feedbacks.meta.orderDirection);
    }
  }, []);

  useEffect(() => {
    if (error) useErrorToast(t('action.load_error'));
  }, [error]);

  const buildFeedbackActionColumn = (): TableColumn<IFeedback> => {
    const feedbackMenuItems = [
      {
        name: t('view', { ns: 'common' }),
        icon: EyeIcon,
        onClick: onView,
        type: PopoverMenuRowType.INFO,
      },
      {
        name: t('delete', { ns: 'common' }),
        icon: TrashIcon,
        onClick: onOpenDeleteModal,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: IFeedback) => <PopoverMenu row={row} menuItems={feedbackMenuItems} />,
      width: '50px',
      allowOverflow: true,
    };
  };

  /**
   * PAGINATION
   */
  const onRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
  };

  const onChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const onSort = (column: TableColumn<string>, direction: SortOrder) => {
    setOrderByColumn(column.id as string);
    setOrderDirection(
      direction.toLocaleUpperCase() === OrderDirection.ASC
        ? OrderDirection.ASC
        : OrderDirection.DESC,
    );
  };

  /**
   * ROW ACTIONS
   */
  const onView = (row: IFeedback) => {
    setSelectedFeedback(row);
    setIsViewModalOpen(true);
  };

  const onOpenDeleteModal = (row: IFeedback) => {
    setSelectedFeedback(row);
    setIsConfirmRemoveModalOpen(true);
  };

  const onDelete = () => {
    if (selectedFeedback) {
      removeFeedbackMutation.mutate(selectedFeedback.id, {
        onSuccess: () => {
          useSuccessToast(t('action.remove_success'));
          refetch();
        },
        onSettled: () => {
          setSelectedFeedback(null);
        },
        onError: () => {
          useErrorToast(t('action.remove_error'));
        },
      });
    }
    setIsConfirmRemoveModalOpen(false);
  };

  const onCancelFeedbackRemoval = () => {
    setIsConfirmRemoveModalOpen(false);
    setSelectedFeedback(null);
  };

  const onCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedFeedback(null);
  };

  return (
    <div>
      <div className="w-full bg-white shadow rounded-lg">
        <div className="py-5 lg:px-10 px-5 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold sm:text-lg lg:text-xl text-md">
            {t('title')}
          </p>
        </div>
        <div className="pb-2">
          <DataTableComponent
            columns={[...FeedbackListTableHeaders, buildFeedbackActionColumn()]}
            data={feedbacks.items}
            loading={isLoading}
            pagination
            sortServer
            paginationPerPage={feedbacks.meta.itemsPerPage}
            paginationRowsPerPageOptions={PaginationConfig.rowsPerPageOptions}
            paginationTotalRows={feedbacks.meta.totalItems}
            onChangeRowsPerPage={onRowsPerPageChange}
            onChangePage={onChangePage}
            onSort={onSort}
          />
        </div>
        {isConfirmRemoveModalOpen && (
          <ConfirmationModal
            title={t('remove_modal.title')}
            description={t('remove_modal.description')}
            closeBtnLabel={t('back', { ns: 'common' })}
            confirmBtnLabel={t('delete', { ns: 'common' })}
            onClose={onCancelFeedbackRemoval}
            onConfirm={onDelete}
          />
        )}
        {isViewModalOpen && (
          <FeedbackViewModal
            serviceName={selectedFeedback?.civicCenterService.name}
            fullName={selectedFeedback?.fullName}
            message={selectedFeedback?.message}
            rating={selectedFeedback?.rating}
            onClose={onCloseViewModal}
            interactionDate={selectedFeedback?.interactionDate}
            createdOn={formatDate(selectedFeedback?.createdOn as string)}
          />
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
