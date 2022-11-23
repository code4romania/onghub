import {
  CheckCircleIcon,
  ClockIcon,
  CollectionIcon,
  SunIcon,
  UserGroupIcon,
  UsersIcon,
  ViewGridAddIcon,
} from '@heroicons/react/solid';
import { formatDate } from '../../../common/helpers/format.helper';

interface PartialSimpleDashboardStatistics {
  icon: any;
  title: string;
  iconColor?: string;
}

export const SuperAdminDashboardStatisticsMapping: Record<
  string,
  PartialSimpleDashboardStatistics
> = {
  meanNumberOfUsers: {
    icon: UsersIcon,
    title: 'statistics.mean_number_of_users',
  },
  numberOfActiveOrganizations: {
    icon: SunIcon,
    title: 'statistics.number_of_active_organizations',
  },
  numberOfApps: {
    icon: CollectionIcon,
    title: 'statistics.number_of_apps',
  },
  numberOfPendingRequests: {
    icon: ClockIcon,
    title: 'statistics.number_of_pending_requests',
  },
  numberOfUpdatedOrganizations: {
    icon: CheckCircleIcon,
    title: 'statistics.number_of_updated_organizations',
  },
  numberOfUsers: {
    icon: UserGroupIcon,
    title: 'statistics.number_of_users',
  },
};

export const AdminDashboardSimpleStatisticsMapping: Record<
  string,
  PartialSimpleDashboardStatistics
> = {
  numberOfActiveOrganizations: {
    icon: SunIcon,
    title: 'statistics.number_of_active_organizations',
    iconColor: 'bg-indigo-500',
  },
  numberOfApps: {
    icon: CollectionIcon,
    title: 'statistics.number_of_apps',
    iconColor: 'bg-indigo-500',
  },
};

export const AdminDashboardExtendedStatisticsMapping = {
  isOrganizationUpdated: (isUpdated: boolean, path: string) => ({
    icon: CheckCircleIcon,
    alert: !isUpdated,
    info: [
      {
        title: isUpdated ? 'statistics.updated_data' : 'statistics.outdated_data',
        subtitle: 'statistics.next_update',
      },
    ],
    button: {
      href: path,
      label: 'statistics.view_data',
    },
  }),
  numberOfInstalledApps: (value: number, path: string) => ({
    icon: ViewGridAddIcon,
    info: [
      {
        title: value,
        subtitle: 'statistics.active_apps',
      },
    ],
    button: {
      href: path,
      label: 'statistics.view_active_apps',
    },
  }),
  numberOfUsers: (value: number, button?: { href: string; label: string }) => ({
    icon: UserGroupIcon,
    info: [{ title: value, subtitle: 'statistics.active_users' }],
    button,
  }),
  activity: (values: { organizationCreatedOn: Date; organizationSyncedOn: Date }) => ({
    icon: ClockIcon,
    info: [
      {
        subtitle: formatDate(values.organizationCreatedOn),
        title: 'activity_title',
      },
      { subtitle: formatDate(values.organizationSyncedOn), title: 'last_updated_on' },
    ],
  }),
};
