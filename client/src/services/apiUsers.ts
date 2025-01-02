export async function getUsers() {
  try {
    const res = await fetch('http://localhost:3000/api/users');
    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}
