import { useState, useEffect, useRef } from 'react';
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

  useEffect(() => {
    const authState = localStorage.getItem('auth');
    if (authState) {
      // Rehydrate state
      setAuthState(JSON.parse(authState));
    }
    setIsLoading(false);
  }, []);

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
  }

  // Rehydration step
  // Check if expiresAt exists in the auth object
  // If it exists and it is still more than the current time, reset the timer to the current expiration
  // If it exists and it is less than the current time, logout
  // If it does not, do nothing

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
