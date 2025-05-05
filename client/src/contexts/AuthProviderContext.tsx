import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

import { UserRole } from '../types/UserRole';
import { AuthState } from '../types/AuthState';
import { StoredAuth } from '../types/StoredAuth';

export function AuthProviderContext({
  children,
}: {
  children: React.ReactNode;
}) {
  //authState, setAuthState: user, token, isAuthenticated
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    isAuthenticated: false,
    userRole: null,
    userId: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authState = localStorage.getItem('auth');
    if (authState) {
      // Rehydrate state
      setAuthState(JSON.parse(authState));
    }
    setIsLoading(false);
  }, []);

  function login(token: string, userRole: UserRole, userId?: number) {
    setAuthState({
      token,
      isAuthenticated: true,
      userRole,
      userId,
    });

    const authPayload: StoredAuth = {
      token,
      userId: userId || null,
      userRole,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour expiration
    };
    // Store the auth payload in local storage

    localStorage.setItem('auth', JSON.stringify(authPayload));
  }

  function logout() {
    setAuthState({
      token: null,
      isAuthenticated: false,
      userRole: null,
      userId: null,
    });

    localStorage.removeItem('auth');
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        isAuthenticated: !!authState?.token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProviderContext;
