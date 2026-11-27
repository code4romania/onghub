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
  /** Own auth: load session + profile after a login (no-op promise by default). */
  reloadSession: (() => Promise.resolve()) as () => Promise<void>,
});

export function useAuthContext() {
  return useContext(AuthContext);
}
