import { getAuthToken } from '../lib/getAuthToken';
import { Users } from '../types/Users';

type UpdatedUser = Partial<Users>;

const token = getAuthToken();

export async function getUsers() {
  try {
    const res = await fetch('http://localhost:3000/api/users/all', {
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
  try {
    const res = await fetch('http://localhost:3000/api/users/self', {
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

export async function getUsersByProjectId(projectId: number) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/users/${projectId}/project`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
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
    const res = await fetch(
      `http://localhost:3000/api/users/${userId}/update`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      }
    );
    if (!res.ok) {
      throw new Error('Failed to update User');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}
