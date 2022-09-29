import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { UserRole } from '../pages/users/enums/UserRole.enum';

export const AuthContext = createContext({
  isAuthenticated: false,
  isRestricted: false,
  isOrganizationRestricted: false,
  role: null as UserRole | null,
  setAuthState: {} as Dispatch<
    SetStateAction<{
      isAuthenticated: boolean;
      isRestricted: boolean;
      isOrganizationRestricted: boolean;
    }>
  >,
  logout: () => null,
});

export function useAuthContext() {
  return useContext(AuthContext);
}
