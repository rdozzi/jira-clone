import { apiFetch } from './apiClient';
import { getAuthToken } from '../lib/getAuthToken';

export async function getLogByUserId(userId: number) {
  try {
    const token = getAuthToken();
    const res = await apiFetch(`/api/activity-logs/${userId}/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch activity logs');
    }

    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error('Error fetching activity logs:', err);
    throw err;
  }
}
