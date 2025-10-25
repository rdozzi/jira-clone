import { getAuthToken } from '../lib/getAuthToken';
import { EntityType } from '../types/Attachments';
const token = getAuthToken();

export async function getAttachments(entityType: EntityType, entityId: number) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/attachments/${entityType}/${entityId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!res.ok) {
      throw new Error('Failed to fetch attachments');
    }

    const data = await res.json();

    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}
