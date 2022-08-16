import { BadgeStatus } from '../../../components/status-badge/StatusBadge';
import { RequestStatus } from '../enum/RequestStatus.enum';

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
  [RequestStatus.APPROVED]: 'Aprobat',
  [RequestStatus.DECLINED]: 'Respins',
  [RequestStatus.PENDING]: 'In procesare',
};
