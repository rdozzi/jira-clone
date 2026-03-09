// Commented out function for production build

// import { useState } from 'react';

// function DeleteUser() {
//   const [id, setId] = useState<number | string>('');

//   function handleChange(e: any) {
//     e.preventDefault();
//     const { value } = e.target;
//     setId(Number(value));
//   }

//   async function handleSubmit(e: any): Promise<void> {
//     e.preventDefault();

//     try {
//       const res = await fetch(`http://localhost:3000/api/users/${id}`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       if (!res.ok) {
//         throw new Error('Failed to Delete User');
//       }

//       const result = await res.json();
//       console.log('User delted successfully:', result);
//     } catch (error) {
//       console.error('Could not delete user:', error);
//     }
//   }

//   return (
//     <form method='delete' onSubmit={handleSubmit}>
//       <br />
//       <div>Provide the number of the user you want to delete</div>
//       <label>Id Number: </label>
//       <input
//         type='number'
//         id='userId'
//         name='userId'
//         defaultValue={id}
//         onChange={handleChange}
//       />
//       <br />
//       <button type='submit'>Delete User</button>
//     </form>
//   );
// }

// export default DeleteUser;
