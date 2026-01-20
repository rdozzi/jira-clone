// Commented out function for production build

// import { useState } from 'react';

// function CreateUser() {
//   const [formData, setFormData] = useState({
//     name: 'Judith',
//     email: 'judith@example.com',
//     passwordHash: 'password!556',
//     role: 'USER',
//   });

//   function handleChange(e: any) {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   }

//   async function handleSubmit(e: any): Promise<void> {
//     e.preventDefault();
//     try {
//       const res = await fetch('http://localhost:3000/api/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       if (!res.ok) {
//         throw new Error('Failed to create user');
//       }

//       const result = await res.json();
//       console.log('User created successfully:', result);
//     } catch (error) {
//       console.error('Error create user:', error);
//     }
//   }

//   return (
//     <>
//       <form method='post' onSubmit={handleSubmit}>
//         <br />
//         <label>Name: </label>
//         <input
//           type='text'
//           id='name'
//           name='name'
//           defaultValue={formData.name}
//           onChange={handleChange}
//         />
//         <br />
//         <label>Email: </label>
//         <input
//           type='text'
//           id='email'
//           name='email'
//           defaultValue={formData.email}
//           onChange={handleChange}
//         />
//         <br />
//         <label>Password: </label>
//         <input
//           type='text'
//           id='password'
//           name='passwordHash'
//           defaultValue={formData.passwordHash}
//           onChange={handleChange}
//         />
//         <br />
//         <label>Role: </label>
//         <input
//           type='text'
//           id='role'
//           name='role'
//           defaultValue={formData.role}
//           onChange={handleChange}
//         />
//         <br />

//         <button type='submit'>Create A User</button>
//       </form>
//     </>
//   );
// }

// export default CreateUser;
