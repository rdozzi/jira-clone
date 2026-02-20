import { apiFetch } from './apiClient';

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const authPayload = await res.json().catch(() => null);

    if (!res.ok) {
      const error: any = new Error(authPayload?.message || 'Login failed');
      error.status = res.status;
      throw error;
    }
    return authPayload;
  } catch (error: any | unknown) {
    if (error instanceof Error) {
      throw error;
    }
  }
}

export async function logout(token: string | null) {
  try {
    const res = await apiFetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error('Failed to log out');
    }
    return res;
  } catch (err: any | unknown) {
    console.error(err);
  }
}
