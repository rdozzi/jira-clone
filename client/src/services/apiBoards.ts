import { getAuthToken } from '../lib/getAuthToken';

const token = getAuthToken();

export async function getBoards() {
  try {
    const res = await fetch(`http://localhost:3000/api/boards`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch boards');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function getBoardsByProjectId(projectId: number) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/boards/${projectId}/project`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!res.ok) {
      throw new Error('Failed to fetch boards');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function createBoard(boardObject: object) {
  try {
    const res = await fetch('http://localhost:3000/api/boards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(boardObject),
    });
    if (!res.ok) {
      throw new Error('Failed to create board');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}
