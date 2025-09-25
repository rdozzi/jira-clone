import { getAuthToken } from '../lib/getAuthToken';

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
