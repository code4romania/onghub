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
    title: 'Numar mediu de utiliatori per organizatie',
  },
  numberOfActiveOrganizations: {
    icon: SunIcon,
    title: 'Organizatii active in ONG Hub',
  },
  numberOfApps: {
    icon: CollectionIcon,
    title: 'Aplicatii disponibile',
  },
  numberOfPendingRequests: {
    icon: ClockIcon,
    title: 'Cereri inscriere organizatii in asteptare',
  },
  numberOfUpdatedOrganizations: {
    icon: CheckCircleIcon,
    title: 'Numar de organizatii cu datele actualizate',
  },
  numberOfUsers: {
    icon: UserGroupIcon,
    title: 'Numar total de utilizatori individuali',
  },
};

export const AdminDashboardSimpleStatisticsMapping: Record<
  string,
  PartialSimpleDashboardStatistics
> = {
  numberOfActiveOrganizations: {
    icon: SunIcon,
    title: 'Organizatii active in ONG Hub',
    iconColor: 'bg-indigo-500',
  },
  numberOfApps: {
    icon: CollectionIcon,
    title: 'Aplicatii disponibile',
    iconColor: 'bg-indigo-500',
  },
};

export const AdminDashboardExtendedStatisticsMapping = {
  isOrganizationUpdated: (isUpdated: boolean) => ({
    icon: CheckCircleIcon,
    alert: !isUpdated,
    info: [
      {
        title: isUpdated
          ? 'Datele organizației sunt actualizate'
          : 'Datele organizatiei nu sunt actualizate',
        subtitle: 'Următoarea actualizare de date va fi necesară la 30 Iunie 2023.',
      },
    ],
    button: {
      href: 'organization/finanicial',
      label: 'Vizualizeaza datele',
    },
  }),
  numberOfInstalledApps: (value: number) => ({
    icon: ViewGridAddIcon,
    info: [
      {
        title: value,
        subtitle: 'Aplicații active',
      },
    ],
    button: {
      href: 'apps',
      label: 'Vezi aplicatiile tale',
    },
  }),
  numberOfUsers: (value: number) => ({
    icon: UserGroupIcon,
    info: [{ title: value, subtitle: 'Utilizatori în orgaizație' }],
    button: {
      href: 'users',
      label: 'Gestioneaza utilizatori',
    },
  }),
  activity: (values: { organizationCreatedOn: Date; organizationSyncedOn: Date }) => ({
    icon: ClockIcon,
    info: [
      {
        subtitle: formatDate(values.organizationCreatedOn),
        title: 'Organizație activă în ONG Hub din',
      },
      { subtitle: formatDate(values.organizationSyncedOn), title: 'Ultima actualizare de date' },
    ],
  }),
};
