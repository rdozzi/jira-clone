import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

import { OrganizationRole } from '../types/OrganizationRole';
import { AuthState } from '../types/AuthState';
import { StoredAuth } from '../types/StoredAuth';

export function AuthProviderContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    isAuthenticated: false,
    organizationRole: null,
    userId: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const loginTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback(
    function logout() {
      setAuthState({
        token: null,
        isAuthenticated: false,
        organizationRole: null,
        userId: null,
      });

      if (loginTimeout.current) clearTimeout(loginTimeout.current);
      localStorage.removeItem('auth');
      navigate('/login', { replace: true });
    },
    [navigate]
  );

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setAuthState(parsed);

      const { expiresAt } = parsed;
      if (expiresAt) {
        const now = Date.now();
        const exp = Number(expiresAt);

        if (exp > now) {
          const delay = exp - now;
          const safeDelay = Math.max(0, Math.min(delay, 24 * 60 * 60 * 1000));

          if (loginTimeout.current) clearTimeout(loginTimeout.current);
          loginTimeout.current = setTimeout(() => {
            logout();
          }, safeDelay);
        } else {
          logout();
        }
      }
    }

    setIsLoading(false);

    return () => {
      if (loginTimeout.current) clearTimeout(loginTimeout.current);
    };
  }, [logout]);

  function login(
    token: string,
    organizationRole: OrganizationRole,
    expiresIn: number,
    userId?: number
  ) {
    setAuthState({
      token,
      isAuthenticated: true,
      organizationRole,
      userId,
    });

    const now = Date.now();
    const delay = expiresIn > now ? expiresIn - now : expiresIn;
    const safeDelay = Math.max(0, Math.min(delay, 24 * 60 * 60 * 1000));

    // Set logout timer
    loginTimeout.current = setTimeout(() => {
      logout();
    }, safeDelay);

    const authPayload: StoredAuth = {
      token,
      userId: userId || null,
      organizationRole,
      expiresAt: String(now + safeDelay), // 1 day expiration
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
        isAuthenticated: !!authState?.token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProviderContext;
