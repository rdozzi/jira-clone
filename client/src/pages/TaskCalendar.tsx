import { useState, memo, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';

import type { Dayjs } from 'dayjs';
import type { CalendarProps, SegmentedProps } from 'antd';
import { Record } from './TicketList';
import { Calendar, Button, DatePicker, Segmented, Tooltip } from 'antd';
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';

import { useTickets } from '../contexts/useTickets';
import { useModal } from '../contexts/useModal';

import TicketModal from '../ui/TicketModal';
import TaskCalendarTicketList from '../ui/TaskCalendarTicketList';

type CellRenderRecord = Record;

type ViewMode = 'month' | 'year';

const TaskCalender = memo(function TaskCalender() {
  const [date, setDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const { isLoading, tickets = [] } = useTickets(); // Add error later
  const { isOpen, openModal, closeModal, mode, modalProps } = useModal();

  const record = modalProps?.record;

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
          <Tooltip title="Go to today's date">
            <Button type='link' onClick={() => setDate(dayjs())}>
              Today
            </Button>
          </Tooltip>
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

  const formattedTickets = useMemo(() => {
    if (!tickets) return [];
    return tickets.map((ticket: CellRenderRecord) => ({
      ...ticket,
      dueDate: dayjs(ticket.dueDate).format('YYYY-MM-DD'),
    }));
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
      const ticketsForDate = formattedTickets.filter(
        (ticket: CellRenderRecord) =>
          ticket.dueDate.toString() === formattedDate
      );
      return <TaskCalendarTicketList tickets={ticketsForDate} />;
    } else if (info?.type === 'month' && viewMode === 'year') {
      const formattedDate = dayjs(date).format('YYYY-MM');
      const groupedTickets = formattedTickets.reduce<{
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
    <div
      style={{
        margin: '4px',
        borderRadius: 8,
        padding: 4,
        background: 'var(--antd-background, transparent)',
      }}
    >
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

      <TicketModal
        isOpen={isOpen}
        closeModal={closeModal}
        mode={mode}
        record={record}
      />
    </div>
  );
});
export default TaskCalender;
