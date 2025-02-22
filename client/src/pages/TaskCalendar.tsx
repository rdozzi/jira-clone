import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import { Calendar, Card, Button, DatePicker, DatePickerProps } from 'antd';
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';

import { useGetTickets } from '../features/tickets/useGetTickets';
import { useModal } from '../contexts/useModal';

import TicketModal from '../ui/TicketModal';
import TicketListItemButton from '../ui/TicketListItemButton';

function TaskCalender() {
  const [ticketState, setTicketState] = useState([]);
  const [date, setDate] = useState(dayjs());
  const { isLoading, tickets, error } = useGetTickets();
  const { isOpen, openModal, closeModal, mode, modalProps } = useModal();

  useEffect(() => {
    if (tickets) {
      const formattedTickets = tickets.map((ticket) => ({
        ...ticket,
        dueDate: dayjs(ticket.dueDate).format('YYYY-MM-DD'),
      }));
      setTicketState(formattedTickets);
    }
  }, [tickets]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function handleCreate() {
    openModal('create', {});
  }

  const headerRender = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '4px',
      }}
    >
      <EditOutlined style={{ fontSize: '16px' }} onClick={handleCreate} />
      <Button type='link' onClick={() => setDate(date.add(-1, 'month'))}>
        <LeftCircleOutlined />
      </Button>
      <Button type='link' onClick={() => setDate(dayjs())}>
        Today
      </Button>
      <Button type='link' onClick={() => setDate(date.add(1, 'month'))}>
        <RightCircleOutlined />
      </Button>
      <DatePicker
        picker='month'
        value={date}
        onChange={(newDate) => setDate(newDate)}
        format='MMM YYYY'
      />
    </div>
  );

  function cellRender(date, info) {
    if (info.type === 'date') {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const ticketsForDate = ticketState.filter(
        (ticket) => ticket.dueDate === formattedDate
      );

      return (
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {ticketsForDate.map((ticket) => (
            <li
              key={ticket.id}
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* <Card style={{ width: '100%' }}>{ticket.title}</Card> */}
              <span
                style={{
                  margin: '1px',
                  // borderRadius: '10px',
                  padding: '2px 5px 2px 5px',
                  maxWidth: '100px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  backgroundColor: '#ADD8E6',
                  textAlign: 'center',
                }}
              >
                {ticket.title}
              </span>
              <span style={{ marginLeft: '5px', marginRight: '5px' }}>
                <TicketListItemButton record={ticket} />
              </span>
            </li>
          ))}
        </ul>
      );
    } else {
      return null;
    }
  }

  return (
    <>
      <Calendar
        cellRender={cellRender}
        value={date}
        headerRender={() => headerRender}
        // style={{ textAlign: 'left' }}
      />
      {mode === 'create' && (
        <TicketModal
          isOpen={isOpen}
          closeModal={closeModal}
          mode={mode}
          {...modalProps}
        />
      )}
    </>
  );
}
export default TaskCalender;
