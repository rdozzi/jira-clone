import { getAuthToken } from '../lib/getAuthToken';
import { apiFetch } from './apiClient';

export async function getOrganization() {
  try {
    const token = getAuthToken();
    const res = await apiFetch(`/api/organization`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch organization');
    }
    const { data } = await res.json();

    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}
