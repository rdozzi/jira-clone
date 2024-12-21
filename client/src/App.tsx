import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
}

function App() {
  const [userData, setUserData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/users');
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await res.json();
        setUserData(data);
      } catch (err: any | unknown) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <ul>
        {userData.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
