import { getAuthToken } from '../lib/getAuthToken';
import { Boards } from '../types/Boards';

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
      const errorText = await res.text();
      console.error('Error:', res.status, res.statusText, errorText);
      throw new Error('Failed to create board');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(`Error ${err.message}`);
  }
}

export async function deleteBoard(boardId: number) {
  try {
    const res = await fetch(`http://localhost:3000/api//boards/${boardId}`, {
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

export async function updateBoard(boardId: number, board: Partial<Boards>) {
  try {
    const res = await fetch(`http://localhost:3000/api/boards/${boardId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(board),
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
