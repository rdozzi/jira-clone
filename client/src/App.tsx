import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './ui/AppLayout';
import TicketList from './pages/TicketList';
import KanbanBoard from './pages/KanbanBoard';
import Calender from './pages/Calender';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path='tickets/ticketlist' element={<TicketList />} />
          <Route path='tickets/kanbanboard' element={<KanbanBoard />} />
          <Route path='tickets/calendar' element={<Calender />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
