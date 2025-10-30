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
    const res = await fetch(`http://localhost:3000/api/attachments/single`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
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

export async function deleteSingleAttachment(attachmentId: number) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/attachments/${attachmentId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error:', res.status, res.statusText, errorText);
      throw new Error('Failed to delete board');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(`Error ${err.message}`);
  }
}

export async function downloadAttachment(attachmentId: number) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/attachments/${attachmentId}/download`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Download failed: ${errText}`);
    }

    console.log(res);

    const contentDisposition = res.headers.get('Content-Disposition');
    let fileName = 'downloaded-file';

    console.log(contentDisposition);

    if (contentDisposition) {
      const match = contentDisposition.match(/filename=""?([^"]+)"?/);
      if (match && match[1]) {
        fileName = decodeURIComponent(match[1])
          .replace(/[/\\?%*:|"<>]/g, '_')
          .trim();
      }

      const blob = await res.blob();

      // Restrict the incoming blog size to 100 MB
      const MAX_SIZE_MB = 100;
      if (blob.size > MAX_SIZE_MB * 1024 * 1024) {
        throw new Error(
          `File too large (${(blob.size / 1024 / 1024).toFixed(1)} MB)`
        );
      }

      // Create temporary URL, append to DOM, download using browser, then cleanup
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    }
  } catch (err: any | unknown) {
    console.error('Failed to download attchment:', err);
  }
}
