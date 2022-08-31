import { BadgeStatus } from '../../../components/status-badge/StatusBadge';
import { ApplicationStatus } from '../../../services/application/interfaces/Application.interface';

export const ApplicationStatusBadgeMapper = (status: ApplicationStatus) => {
  if (!status) {
    return BadgeStatus.WARNING;
  }

  switch (status) {
    case ApplicationStatus.ACTIVE: {
      return BadgeStatus.SUCCESS;
    }
    case ApplicationStatus.DISABLED: {
      return BadgeStatus.ERROR;
    }
  }
};

export const APPLICATION_STATUS_NAME: Record<ApplicationStatus, string> = {
  [ApplicationStatus.ACTIVE]: 'Activ',
  [ApplicationStatus.DISABLED]: 'Inactiv',
};

export const ApplicationStatusCollection = [
  {
    status: ApplicationStatus.ACTIVE,
    label: 'Activ',
  },
  {
    status: ApplicationStatus.DISABLED,
    label: 'Inactiv',
  },
];
