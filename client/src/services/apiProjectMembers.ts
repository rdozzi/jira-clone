import { getAuthToken } from '../lib/getAuthToken';

interface MemberInfo {
  userId: number;
  projectRole: string;
}

export async function getProjectMembers(projectId: number | null) {
  if (projectId === null) return;
  try {
    const token = getAuthToken();

    const res = await fetch(
      `http://localhost:3000/api/projectMembers/${projectId}/members`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
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

export async function addProjectMember(
  projectId: number,
  memberInfo: MemberInfo,
) {
  try {
    const token = getAuthToken();
    const res = await fetch(
      `http://localhost:3000/api/projectMembers/${projectId}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberInfo),
      },
    );
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error:', res.status, res.statusText, errorText);
      throw new Error('Failed to add project member');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function removeProjectMember(projectId: number, userId: number) {
  try {
    const token = getAuthToken();
    const res = await fetch(
      `http://localhost:3000/api/projectMembers/${projectId}/members/${userId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (!res.ok) {
      throw new Error('Failed to remove project member');
    }
    const data = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function updateProjectMemberRole(
  projectId: number,
  userId: number,
  projectRole: any,
) {
  try {
    const token = getAuthToken();
    const res = await fetch(
      `http://localhost:3000/api/projectMembers/${projectId}/members/${userId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectRole),
      },
    );
    if (!res.ok) {
      throw new Error('Failed to update user project role');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}
