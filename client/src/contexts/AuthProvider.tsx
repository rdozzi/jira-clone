import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

import { OrganizationRole } from '../types/OrganizationRole';
import { AuthState } from '../types/AuthState';
import { StoredAuth } from '../types/StoredAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    isAuthenticated: false,
    organizationRole: null,
    userId: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(
    function logout() {
      setAuthState({
        token: null,
        isAuthenticated: false,
        organizationRole: null,
        userId: null,
      });
      localStorage.removeItem('auth');
      navigate('/login', { replace: true });
    },
    [navigate]
  );

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setAuthState({
        token: parsed.token,
        isAuthenticated: true,
        organizationRole: parsed.organizationRole,
        userId: parsed.userId,
      });
    }

    setIsLoading(false);
  }, []);

  function login(
    token: string,
    organizationRole: OrganizationRole,
    userId?: number
  ) {
    setAuthState({
      token,
      isAuthenticated: true,
      organizationRole,
      userId,
    });

    const authPayload: StoredAuth = {
      token,
      userId: userId || null,
      organizationRole,
    };

    // Store the auth payload in local storage
    localStorage.setItem('auth', JSON.stringify(authPayload));
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        isAuthenticated: authState?.isAuthenticated,
        isLoading,
        userId: authState?.userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
