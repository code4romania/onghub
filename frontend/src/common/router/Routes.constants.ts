import {
  TemplateIcon,
  UserGroupIcon,
  ViewGridAddIcon,
  CollectionIcon,
} from '@heroicons/react/outline';
import { SunIcon } from '@heroicons/react/solid';

export const NAVIGATION_ROUTES = [
  { id: 0, name: 'Dashboard', href: '', icon: TemplateIcon },
  { id: 1, name: 'Organizatia mea', href: 'organization', icon: SunIcon },
  { id: 2, name: 'Utilizatori', href: 'users', icon: UserGroupIcon },
  { id: 3, name: 'Aplicatiile mele', href: 'apps', icon: ViewGridAddIcon },
  { id: 4, name: 'Toate aplicatiile', href: 'store', icon: CollectionIcon },
];
