import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { UserRole } from '../pages/users/enums/UserRole.enum';

export const AuthContext = createContext({
  isAuthenticated: false,
  isRestricted: false,
  restrictedReason: '',
  role: null as UserRole | null,
  setAuthState: {} as Dispatch<
    SetStateAction<{
      isAuthenticated: boolean;
      isRestricted: boolean;
      restrictedReason: string;
    }>
  >,
  logout: () => null,
});

export function useAuthContext() {
  return useContext(AuthContext);
}
