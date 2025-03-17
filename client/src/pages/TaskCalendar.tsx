import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';

import type { Dayjs } from 'dayjs';
import type { CalendarProps, SegmentedProps } from 'antd';
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
import TaskCalendarTicketList from '../ui/TaskCalendarTicketList';

type CellRenderRecord = Record;

type ViewMode = 'month' | 'year';

const TaskCalender = memo(function TaskCalender() {
  const [ticketState, setTicketState] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const { isLoading, tickets } = useGetTickets(); // Add error later
  const { isOpen, openModal, closeModal, mode, modalProps } = useModal();

  const handleCreate = useCallback(
    function handleCreate() {
      openModal('create', {});
    },
    [openModal]
  );

  const navType = useMemo(
    () => (viewMode === 'month' ? 'month' : 'year'),
    [viewMode]
  );

  const handlePrev = useCallback(
    () => setDate(date.add(-1, navType)),
    [date, navType]
  );
  const handleNext = useCallback(
    () => setDate(date.add(1, navType)),
    [date, navType]
  );

  const controls = useMemo(
    () => (
      <span>
        <Button type='link' onClick={handlePrev}>
          <LeftCircleOutlined />
        </Button>
        {viewMode === 'month' ? (
          <Button type='link' onClick={() => setDate(dayjs())}>
            Today
          </Button>
        ) : null}
        <Button type='link' onClick={handleNext}>
          <RightCircleOutlined />
        </Button>
        <DatePicker
          picker={navType}
          value={date}
          onChange={(newDate) => setDate(newDate)}
          format={viewMode === 'month' ? 'MMM YYYY' : 'YYYY'}
          transitionName=''
          getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
        />
      </span>
    ),
    [navType, viewMode, date, handlePrev, handleNext]
  );

  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      setViewMode(mode);
    },
    [setViewMode]
  );

  useEffect(() => {
    if (tickets) {
      const formattedTickets = tickets.map((ticket: CellRenderRecord) => ({
        ...ticket,
        dueDate: dayjs(ticket.dueDate).format('YYYY-MM-DD'),
      }));
      setTicketState(formattedTickets);
    }
  }, [tickets]);

  const segmentOptions: SegmentedProps<ViewMode>['options'] = useMemo(
    () => [
      { label: 'Month', value: 'month' },
      { label: 'Year', value: 'year' },
    ],
    []
  );

  const headerRender = useCallback(
    function headerRender() {
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
          </span>
          {controls}
          <span>
            <Segmented
              options={segmentOptions}
              value={viewMode}
              onChange={handleViewModeChange}
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
    },
    [controls, handleCreate, viewMode, segmentOptions, handleViewModeChange]
  );

  type CellRenderInfoType = Parameters<
    NonNullable<CalendarProps<Dayjs>['cellRender']>
  >[1];

  function cellRender(date: Dayjs, info: CellRenderInfoType) {
    if (info?.type === 'date' && viewMode === 'month') {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const ticketsForDate = ticketState.filter(
        (ticket: CellRenderRecord) =>
          ticket.dueDate.toString() === formattedDate
      );
      return <TaskCalendarTicketList tickets={ticketsForDate} />;
    } else if (info?.type === 'month' && viewMode === 'year') {
      const formattedDate = dayjs(date).format('YYYY-MM');
      const groupedTickets = ticketState.reduce<{
        [key: string]: CellRenderRecord[];
      }>((acc, ticket: CellRenderRecord) => {
        const monthKey = dayjs(ticket.dueDate).format('YYYY-MM');
        acc[monthKey] = acc[monthKey] || [];
        acc[monthKey].push(ticket);
        return acc;
      }, {});

      return (
        <TaskCalendarTicketList tickets={groupedTickets[formattedDate] || []} />
      );
    } else {
      return null;
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
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
