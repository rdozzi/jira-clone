import { getAuthToken } from '../lib/getAuthToken';
import { ProjectViewAllProjects } from '../types/Projects';

export async function getProjects() {
  try {
    const token = getAuthToken();
    const res = await fetch(`http://localhost:3000/api/projects`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch projects');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function getProjectsByUserId() {
  try {
    const token = getAuthToken();
    const res = await fetch(`http://localhost:3000/api/projects/my-projects`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch projects');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function createProject(projectObject: object) {
  try {
    const token = getAuthToken();
    const res = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectObject),
    });
    if (!res.ok) {
      throw new Error('Failed to create project');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function deleteProject(projectId: number) {
  try {
    const token = getAuthToken();
    const res = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
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

export async function updateProject(
  projectId: number,
  project: Partial<ProjectViewAllProjects>
) {
  try {
    const token = getAuthToken();
    const res = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
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
