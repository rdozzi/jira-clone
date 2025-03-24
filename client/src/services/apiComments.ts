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
