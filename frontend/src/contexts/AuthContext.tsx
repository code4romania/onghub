import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  setAuthState: {} as Dispatch<SetStateAction<{ isAuthenticated: boolean }>>,
  logout: () => null,
});

export function useAuthContext() {
  return useContext(AuthContext);
}
