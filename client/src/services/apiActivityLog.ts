import { getAuthToken } from '../lib/getAuthToken';
const token = getAuthToken();

export async function getLogByUserId(userId: number) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/activity-logs/${userId}/user`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
