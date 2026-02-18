import { getAuthToken } from '../lib/getAuthToken';
import { Users } from '../types/Users';
import { apiFetch } from './apiClient';

type UpdatedUser = Partial<Users>;

export async function getUsers() {
  const token = getAuthToken();
  try {
    const res = await apiFetch(`/api/users/all`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function getUserSelf() {
  const token = getAuthToken();
  const res = await apiFetch(`/api/users/self`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  const { data } = await res.json();
  return data;
}

export async function getUsersByProjectId(projectId: number) {
  try {
    const token = getAuthToken();
    const res = await apiFetch(`/api/users/${projectId}/project`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function updateUser(userId: number, userInfo: UpdatedUser) {
  try {
    const token = getAuthToken();
    const res = await apiFetch(`/api/users/${userId}/update`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });
    if (!res.ok) {
      throw new Error('Failed to update User');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function updateUserPasswordSelf(
  newPassword: string,
  confirmPassword: string,
) {
  try {
    const token = getAuthToken();
    const res = await apiFetch(`/api/users/updatePasswordSelf`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      }),
    });
    if (!res.ok) {
      throw new Error('Failed to update User');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}
