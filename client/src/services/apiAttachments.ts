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

export async function uploadSingleAttachment(formData: FormData) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/attachments/attachments/single`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: formData,
      }
    );
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error:', res.status, res.statusText, errorText);
      throw new Error('Failed to update board');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}
