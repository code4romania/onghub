import {
  RectangleGroupIcon,
  UserGroupIcon,
  SquaresPlusIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import { CircleStackIcon, SunIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import i18n from '../config/i18n';

const translations = {
  dashboard: i18n.t('routes:dashboard'),
  organization: i18n.t('routes:organization'),
  apps: i18n.t('routes:apps'),
  users: i18n.t('routes:users'),
  store: i18n.t('routes:store'),
  practiceProgram: i18n.t('routes:practice_programs'),
  organizations: i18n.t('routes:organizations'),
  requests: i18n.t('routes:requests'),
};

export const EMPLOYEE_ROUTES = [
  { id: 0, name: translations.dashboard, href: '', icon: RectangleGroupIcon },
  { id: 1, name: translations.organization, href: 'organization', icon: SunIcon },
  { id: 2, name: translations.apps, href: 'applications', icon: SquaresPlusIcon },
];

export const ADMIN_ROUTES = [
  { id: 0, name: translations.dashboard, href: '', icon: RectangleGroupIcon },
  { id: 1, name: translations.organization, href: 'organization/general', icon: SunIcon },
  { id: 2, name: translations.users, href: 'users/list', icon: UserGroupIcon },
  { id: 3, name: translations.apps, href: 'my-apps', icon: SquaresPlusIcon },
  { id: 4, name: translations.store, href: 'all-apps', icon: RectangleStackIcon },
];

export const SUPER_ADMIN_ROUTES = [
  { id: 0, name: translations.dashboard, href: '', icon: RectangleGroupIcon },
  { id: 1, name: translations.organizations, href: 'organizations', icon: CircleStackIcon },
  { id: 2, name: translations.requests, href: 'requests', icon: UserPlusIcon },
  { id: 3, name: translations.store, href: 'applications', icon: RectangleStackIcon },
];
