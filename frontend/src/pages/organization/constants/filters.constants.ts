import i18n from '../../../common/config/i18n';
import { CompletionStatus } from '../enums/CompletionStatus.enum';

const translations = {
  incomplete: i18n.t('organization:filters.incomplete'),
  updated: i18n.t('organization:filters.updated'),
  any: i18n.t('organization:filters.any'),
};

export const OrganizationCompletionStatusOptions = [
  {
    status: null,
    label: translations.any,
  },
  {
    status: CompletionStatus.NOT_COMPLETED,
    label: translations.incomplete,
  },
  {
    status: CompletionStatus.COMPLETED,
    label: translations.updated,
  },
];

export const OrganizationsUsersCountOptions = [
  {
    label: 'Toti',
    status: '',
  },
  {
    label: '0-100',
    status: '$btw:0,100',
  },
  {
    label: '100-300',
    status: '$btw:100,300',
  },
  {
    label: '300+',
    status: '$gte:300',
  },
];
