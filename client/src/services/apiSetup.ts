import { OrgRegistrationPayload } from '../types/OrgRegistration';
import { apiFetch } from './apiClient';

export async function createOrg(
  orgRegistrationPayload: OrgRegistrationPayload,
) {
  try {
    const res = await apiFetch(
      `/api/setup/create-organization-and-superadmin`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orgRegistrationPayload),
      },
    );

    const createOrgPayload = await res.json().catch(() => null);

    if (!res.ok) {
      const error: any = new Error(
        createOrgPayload?.message || 'Org creation failed',
      );
      error.status = res.status;
      throw error;
    }
    return createOrgPayload;
  } catch (error: any | unknown) {
    if (error instanceof Error) {
      throw error;
    }
  }
}
