import {
  TemplateIcon,
  UserGroupIcon,
  ViewGridAddIcon,
  CollectionIcon,
} from '@heroicons/react/outline';
import { DatabaseIcon, SunIcon, UserAddIcon } from '@heroicons/react/solid';

export const EMPLOYEE_ROUTES = [
  { id: 0, name: 'Dashboard', href: '', icon: TemplateIcon },
  { id: 1, name: 'Organizatia mea', href: 'organization', icon: SunIcon },
  { id: 2, name: 'Aplicatiile mele', href: 'apps', icon: ViewGridAddIcon },
];

export const ADMIN_ROUTES = [
  { id: 0, name: 'Dashboard', href: '', icon: TemplateIcon },
  { id: 1, name: 'Organizatia mea', href: 'organization', icon: SunIcon },
  { id: 2, name: 'Utilizatori', href: 'users', icon: UserGroupIcon },
  { id: 3, name: 'Aplicatiile mele', href: 'apps', icon: ViewGridAddIcon },
  { id: 4, name: 'Toate aplicatiile', href: 'all-apps', icon: CollectionIcon },
];

export const SUPER_ADMIN_ROUTES = [
  { id: 0, name: 'Dashboard', href: '', icon: TemplateIcon },
  { id: 1, name: 'ONG-uri', href: 'organizations', icon: DatabaseIcon },
  { id: 2, name: 'Utilizatori', href: 'users', icon: UserGroupIcon },
  { id: 3, name: 'Solicitari Access', href: 'requests', icon: UserAddIcon },
  { id: 4, name: 'Toate aplicatiile', href: 'all-apps', icon: CollectionIcon },
];
