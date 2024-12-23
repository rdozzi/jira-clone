import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
}

function GetUserById() {
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserbyId = async (id: number) => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }
        const data: User = await res.json();
        setUserData(data);
      } catch (err: any | unknown) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchUserbyId(1);
  }, []);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <span>
        {userData
          ? `User Id: ${userData.id}, User Name: ${userData.name}`
          : 'Loading'}
      </span>
    </div>
  );
}

export default GetUserById;
