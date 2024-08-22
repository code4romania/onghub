import {
  ClockIcon,
  RectangleStackIcon,
  SunIcon,
  UserGroupIcon,
  UsersIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/solid';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
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
    icon: RectangleStackIcon,
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
    icon: RectangleStackIcon,
    title: 'statistics.number_of_apps',
    iconColor: 'bg-indigo-500',
  },
};

export const AdminEmployeeDashboardExtendedStatisticsMapping = {
  isOrganizationFinancialReportsUpdated: (isUpdated: boolean) => ({
    icon: isUpdated ? CheckCircleIcon : ExclamationTriangleIcon,
    alert: !isUpdated,
    info: [
      {
        title: isUpdated
          ? 'Informațiile financiare sunt actualizate'
          : 'Informațiile financiare nu sunt actualizate',
        subtitle: isUpdated ? 'statistics.next_year_update' : 'statistics.next_update',
      },
    ],
    button: {
      href: 'organization/financial',
      label: 'statistics.view_data',
    },
  }),
  isOrganizationReportsPartnersInvestorsUpdated: (isUpdated: boolean) => ({
    icon: isUpdated ? CheckCircleIcon : ExclamationTriangleIcon,
    alert: !isUpdated,
    info: [
      {
        title: isUpdated
          ? 'Informațiile din secțiunea “ONG-ul în numere” sunt actualizate'
          : 'Informațiile din secțiunea “ONG-ul în numere” nu sunt actualizate',
        subtitle: isUpdated ? 'statistics.next_year_update' : 'statistics.next_update',
      },
    ],
    button: {
      href: 'organization/data',
      label: 'statistics.view_data',
    },
  }),
  numberOfInstalledApps: (value: number, isAdmin: boolean) => ({
    icon: SquaresPlusIcon,
    info: [
      {
        title: value,
        subtitle: 'statistics.active_apps',
      },
    ],
    button: {
      href: isAdmin ? 'my-apps' : 'applications',
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
  isOrganizationFinancialReportsUpdated: (isUpdated: boolean, organizationId?: number) => ({
    icon: isUpdated ? CheckCircleIcon : ExclamationTriangleIcon,
    alert: !isUpdated,
    info: [
      {
        title: isUpdated
          ? 'Informațiile financiare sunt actualizate'
          : 'Informațiile financiare nu sunt actualizate',
        subtitle: isUpdated ? 'statistics.next_year_update' : 'statistics.next_update',
      },
    ],
    button: {
      href: `/organizations/${organizationId}/financial`,
      label: 'statistics.view_data',
    },
  }),
  isOrganizationReportsPartnersInvestorsUpdated: (isUpdated: boolean, organizationId?: number) => ({
    icon: ExclamationTriangleIcon,
    alert: !isUpdated,
    info: [
      {
        title: isUpdated
          ? 'Informațiile din secțiunea “ONG-ul în numere” sunt actualizate'
          : 'Informațiile din secțiunea “ONG-ul în numere” nu sunt actualizate',
        subtitle: isUpdated ? 'statistics.next_year_update' : 'statistics.next_update',
      },
    ],
    button: {
      href: `organization/${organizationId}/data`,
      label: 'statistics.view_data',
    },
  }),
  numberOfInstalledApps: (value: number, organizationId?: number) => ({
    icon: SquaresPlusIcon,
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
