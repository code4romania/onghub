import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../../../common/helpers/format.helper';
import { IFeedback } from '../../../interfaces/Feedback.interface';
import i18n from '../../../../../common/config/i18n';

const translations = {
  serviceName: i18n.t('feedback:header.service_name'),
  rating: i18n.t('feedback:header.rating'),
  interactionDate: i18n.t('feedback:header.interaction_date'),
  feedbackAuthor: i18n.t('feedback:header.feedback_author'),
  createdOn: i18n.t('feedback:header.created_on'),
};

export const FeedbackListTableHeaders: TableColumn<IFeedback>[] = [
  {
    id: 'civicCenterService.name',
    name: translations.serviceName,
    sortable: true,
    grow: 4,
    minWidth: '15rem',
    selector: (row: IFeedback) => row.civicCenterService.name,
  },
  {
    id: 'rating',
    name: translations.rating,
    sortable: true,
    grow: 1,
    minWidth: '10rem',
    selector: (row: IFeedback) => row.rating,
  },
  {
    id: 'interactionDate',
    name: translations.interactionDate,
    sortable: true,
    grow: 2,
    minWidth: '15rem',
    selector: (row: IFeedback) => row.interactionDate,
  },
  {
    id: 'fullName',
    name: translations.feedbackAuthor,
    sortable: true,
    grow: 2,
    minWidth: '15rem',
    selector: (row: IFeedback) => row.fullName,
  },
  {
    id: 'createdOn',
    name: translations.createdOn,
    sortable: true,
    grow: 1,
    minWidth: '10rem',
    selector: (row: IFeedback) => formatDate(row?.createdOn as string),
  },
];
