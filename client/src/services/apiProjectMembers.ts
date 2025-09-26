import { getAuthToken } from '../lib/getAuthToken';

const token = getAuthToken();

export async function getProjectMembers(projectId: number) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/projectMembers/${projectId}/members`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!res.ok) {
      throw new Error('Failed to fetch project members');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}
