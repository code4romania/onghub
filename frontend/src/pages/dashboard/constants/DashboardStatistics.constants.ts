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

export const AdminEmployeeDashboardExtendedStatisticsMapping = {
  isOrganizationUpdated: (isUpdated: boolean) => ({
    icon: CheckCircleIcon,
    alert: !isUpdated,
    info: [
      {
        title: isUpdated ? 'statistics.updated_data' : 'statistics.outdated_data',
        subtitle: 'statistics.next_update',
      },
    ],
    button: {
      href: 'organization/financial',
      label: 'statistics.view_data',
    },
  }),
  numberOfInstalledApps: (value: number) => ({
    icon: ViewGridAddIcon,
    info: [
      {
        title: value,
        subtitle: 'statistics.active_apps',
      },
    ],
    button: {
      href: 'applications/my-apps',
      label: 'statistics.view_active_apps',
    },
  }),
  numberOfUsersAdmin: (value: number) => ({
    icon: UserGroupIcon,
    info: [{ title: value, subtitle: 'statistics.active_users' }],
    button: {
      href: 'users',
      label: 'statistics.handle_users',
    },
  }),
  numberOfUsersEmployee: (value: number) => ({
    icon: UserGroupIcon,
    info: [{ title: value, subtitle: 'statistics.active_users' }],
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

export const SuperAdminOverviewExtendedStatisticsMapping = {
  isOrganizationUpdated: (isUpdated: boolean, organizationId?: number) => ({
    icon: CheckCircleIcon,
    alert: !isUpdated,
    info: [
      {
        title: isUpdated ? 'statistics.updated_data' : 'statistics.outdated_data',
        subtitle: 'statistics.next_update',
      },
    ],
    button: {
      href: `/organizations/${organizationId}/financial`,
      label: 'statistics.view_data',
    },
  }),
  numberOfInstalledApps: (value: number, organizationId?: number) => ({
    icon: ViewGridAddIcon,
    info: [
      {
        title: value,
        subtitle: 'statistics.active_apps',
      },
    ],
    button: {
      href: `/organizations/${organizationId}/applications`,
      label: 'statistics.view_active_apps',
    },
  }),
  numberOfUsers: (value: number) => ({
    icon: UserGroupIcon,
    info: [{ title: value, subtitle: 'statistics.active_users' }],
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
