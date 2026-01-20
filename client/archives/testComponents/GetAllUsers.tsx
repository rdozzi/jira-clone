// Commented out function for production build

// import { useEffect, useState } from 'react';

// interface User {
//   id: string;
//   name: string;
// }

// function GetAllUsers() {
//   const [userData, setUserData] = useState<User[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch('http://localhost:3000/api/users');
//         if (!res.ok) {
//           throw new Error('Failed to fetch users');
//         }
//         const data = await res.json();
//         setUserData(data);
//       } catch (err: any | unknown) {
//         console.error(err);
//         setError(err.message);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // useEffect(() => {
//   //   const fetchUserbyId = async (id: number) => {
//   //     try {
//   //       const res = await fetch(`http://localhost:3000/api/users/${id}`);
//   //       if (!res.ok) {
//   //         throw new Error('Failed to fetch user');
//   //       }
//   //       const data = await res.json();
//   //       setUserData(data);
//   //     } catch (err: any | unknown) {
//   //       console.error(err);
//   //       setError(err.message);
//   //     }
//   //   };
//   //   fetchUserbyId(1);
//   // }, []);

//   return (
//     <div>
//       {error && <p>Error: {error}</p>}
//       <ul>
//         {userData.map((user) => (
//           <li key={user.id}>{user.name}</li>
//         ))}
//       </ul>
//       {/* <span>
//         `User Id: {userData.id}, User Name: {userData.name}`
//       </span>*/}
//     </div>
//   );
// }

// export default GetAllUsers;
