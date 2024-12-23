import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GetAllUsers from './GetAllUsers';
import GetUserById from './GetUserById';
import CreateUser from './CreateUser';
import DeleteUser from './DeleteUser';
import GetTicketsByUserId from './GetTicketsByUserId';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <GetAllUsers /> */}
    {/* <GetUserById /> */}
    {/* <CreateUser /> */}
    {/* <DeleteUser /> */}
    <GetTicketsByUserId />
  </StrictMode>
);
