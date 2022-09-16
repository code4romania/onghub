import { BadgeStatus } from '../../../components/status-badge/StatusBadge';
import { ApplicationStatus } from '../../../services/application/interfaces/Application.interface';
import i18n from '../../../common/config/i18n';

const translations = {
  active: i18n.t('appstore:status.active'),
  disabled: i18n.t('appstore:status.disabled'),
};

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
  [ApplicationStatus.ACTIVE]: translations.active,
  [ApplicationStatus.DISABLED]: translations.disabled,
};

export const ApplicationStatusCollection = [
  {
    status: ApplicationStatus.ACTIVE,
    label: translations.active,
  },
  {
    status: ApplicationStatus.DISABLED,
    label: translations.disabled,
  },
];
