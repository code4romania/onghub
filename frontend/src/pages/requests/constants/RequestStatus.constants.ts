import { BadgeStatus } from '../../../components/status-badge/StatusBadge';
import { RequestStatus } from '../enum/RequestStatus.enum';
import i18n from '../../../common/config/i18n';

const translations = {
  approved: i18n.t('requests:constants.approved'),
  rejected: i18n.t('requests:constants.rejected'),
  pending: i18n.t('requests:constants.pending'),
};

export const RequestStatusBadgeMapper = (status: RequestStatus) => {
  if (!status) {
    return BadgeStatus.WARNING;
  }

  switch (status) {
    case RequestStatus.APPROVED: {
      return BadgeStatus.SUCCESS;
    }
    case RequestStatus.PENDING: {
      return BadgeStatus.WARNING;
    }
    case RequestStatus.DECLINED: {
      return BadgeStatus.ERROR;
    }
  }
};

export const REQUEST_STATUS_NAME: Record<RequestStatus, string> = {
  [RequestStatus.APPROVED]: translations.approved,
  [RequestStatus.DECLINED]: translations.rejected,
  [RequestStatus.PENDING]: translations.pending,
};
