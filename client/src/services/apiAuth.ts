export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (!res.ok) {
      throw new Error('Failed to obtain authorization payload');
    }
    const authPayload = await res.json();
    return authPayload;
  } catch (err: any | unknown) {
    console.error(err);
  }
}
