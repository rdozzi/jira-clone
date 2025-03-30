// Get comments by ticket Id
export async function getCommentsById(ticketId: number) {
  try {
    const res = await fetch(`http://localhost:3000/api/comments/${ticketId}`);
    if (!res.ok) {
      throw new Error('Failed to fetch comments');
    }
    const data = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

// Create a comment by ticket Id - Requires ticketId, authorId, content object
export async function createComment(commentObject: object) {
  try {
    const res = await fetch('http://localhost:3000/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentObject),
    });
    if (!res.ok) {
      throw new Error('Failed to create ticket');
    }
    const data = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

// Delete a comment by ticket Id - Requires ticketId
export async function deleteComment(ticketId: number) {
  try {
    const res = await fetch(`http://localhost:3000/api/comments/${ticketId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete comment');
    }
    const data = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

// Edit a Comment - CommentId and payload required (updatedAt is updated via the ORM)
export async function editComment(commentId: number, content: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      throw new Error('Failed to update comment');
    }
    const data = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error('Comment Error', err);
  }
}
