import { BadgeStatus } from '../../../components/status-badge/StatusBadge';
import { ApplicationStatus } from '../../../services/application/interfaces/Application.interface';
import i18n from '../../../common/config/i18n';
import { OngApplicationStatus } from '../../requests/interfaces/OngApplication.interface';

const translations = {
  active: i18n.t('appstore:status.active'),
  disabled: i18n.t('appstore:status.disabled'),
  any: i18n.t('appstore:status.any'),
  restricted: i18n.t('appstore:status.restricted'),
  pending: i18n.t('appstore:status.pending'),
  pending_removal: i18n.t('appstore:status.pending_removal'),
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

export const OngApplicationStatusBadgeMapper = (status: OngApplicationStatus) => {
  if (!status) {
    return BadgeStatus.SUCCESS;
  }

  switch (status) {
    case OngApplicationStatus.ACTIVE: {
      return BadgeStatus.SUCCESS;
    }
    case OngApplicationStatus.PENDING_REMOVAL:
    case OngApplicationStatus.RESTRICTED: {
      return BadgeStatus.ERROR;
    }
    case OngApplicationStatus.PENDING: {
      return BadgeStatus.WARNING;
    }
  }
};

export const APPLICATION_STATUS_NAME: Record<ApplicationStatus, string> = {
  [ApplicationStatus.ACTIVE]: translations.active,
  [ApplicationStatus.DISABLED]: translations.disabled,
};

export const ONG_APPLICATION_STATUS: Record<OngApplicationStatus, string> = {
  [OngApplicationStatus.ACTIVE]: translations.active,
  [OngApplicationStatus.RESTRICTED]: translations.restricted,
  [OngApplicationStatus.PENDING]: translations.pending,
  [OngApplicationStatus.PENDING_REMOVAL]: translations.pending_removal,
};

export const ApplicationStatusCollection = [
  {
    status: null,
    label: translations.any,
  },
  {
    status: ApplicationStatus.ACTIVE,
    label: translations.active,
  },
  {
    status: ApplicationStatus.DISABLED,
    label: translations.disabled,
  },
];
