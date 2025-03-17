import { useState, useEffect, memo } from 'react';
import dayjs from 'dayjs';

import type { Dayjs } from 'dayjs';
import type { CalendarProps } from 'antd';
import { Record } from '../ui/TicketListItemButton';

import { Calendar, Button, DatePicker, Segmented } from 'antd';
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';

import { useGetTickets } from '../features/tickets/useGetTickets';
import { useModal } from '../contexts/useModal';

import TicketModal from '../ui/TicketModal';
import TicketListItemButton from '../ui/TicketListItemButton';

type CellRenderRecord = Record;

type ViewMode = 'month' | 'year';

const TaskCalender = memo(function TaskCalender() {
  const [ticketState, setTicketState] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const { isLoading, tickets } = useGetTickets(); // Add error later
  const { isOpen, openModal, closeModal, mode, modalProps } = useModal();

  useEffect(() => {
    if (tickets) {
      const formattedTickets = tickets.map((ticket: CellRenderRecord) => ({
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

  function headerRender() {
    if (viewMode === 'month') {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '4px',
          }}
        >
          <span>
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
          </span>
          <span>
            <Segmented
              options={[
                { label: 'Month', value: 'month' },
                { label: 'Year', value: 'year' },
              ]}
              value={viewMode}
              onChange={(val) => setViewMode(val as ViewMode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3px 10px',
              }}
            />
          </span>
        </div>
      );
    } else if (viewMode === 'year') {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '4px',
          }}
        >
          <span>
            <EditOutlined style={{ fontSize: '16px' }} onClick={handleCreate} />
            <Button type='link' onClick={() => setDate(date.add(-1, 'year'))}>
              <LeftCircleOutlined />
            </Button>
            <Button type='link' onClick={() => setDate(date.add(1, 'year'))}>
              <RightCircleOutlined />
            </Button>
            <DatePicker
              picker='year'
              value={date}
              onChange={(newDate) => setDate(newDate)}
              format='YYYY'
            />
          </span>
          <span>
            <Segmented
              options={[
                { label: 'Month', value: 'month' },
                { label: 'Year', value: 'year' },
              ]}
              value={viewMode}
              onChange={(val) => setViewMode(val as ViewMode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3px 10px',
              }}
            />
          </span>
        </div>
      );
    }
  }

  type CellRenderInfoType = Parameters<
    NonNullable<CalendarProps<Dayjs>['cellRender']>
  >[1];

  function cellRender(date: Dayjs, info: CellRenderInfoType) {
    if (info?.type === 'date' && viewMode === 'month') {
      console.log(viewMode);
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const ticketsForDate = ticketState.filter(
        (ticket: CellRenderRecord) =>
          ticket.dueDate.toString() === formattedDate
      );
      console.log(ticketsForDate);
      return (
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {ticketsForDate.map((ticket: CellRenderRecord) => (
            <li
              key={ticket.id}
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  margin: '1px',
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
    } else if (info?.type === 'month' && viewMode === 'year') {
      const groupedTickets: { [key: string]: CellRenderRecord[] } = {};
      ticketState.forEach((ticket: CellRenderRecord) => {
        const month = dayjs(ticket.dueDate).format('YYYY-MM');
        if (!groupedTickets[month]) {
          groupedTickets[month] = [];
        }
        groupedTickets[month].push(ticket);
      });

      const formattedDate = dayjs(date).format('YYYY-MM');
      const monthTickets = groupedTickets[formattedDate] || [];

      return monthTickets.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {monthTickets.map((ticket: CellRenderRecord) => (
            <li
              key={ticket.id}
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  margin: '1px',
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
      ) : null;
    } else {
      return null;
    }
  }

  return (
    <>
      <Calendar
        mode={viewMode}
        onPanelChange={(_, mode) => {
          if (mode !== viewMode) {
            setViewMode(mode as ViewMode);
          }
        }}
        cellRender={cellRender}
        value={date}
        headerRender={headerRender}
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
});
export default TaskCalender;
