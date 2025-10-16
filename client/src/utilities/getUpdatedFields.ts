import { Tickets } from '../types/Tickets';

export function getUpdatedFields(ticketDbEntry: Tickets, updatedValues: any) {
  const updatedFields: any = {};
  for (const key of Object.keys(updatedValues) as (keyof Tickets)[]) {
    const original = ticketDbEntry[key];
    const updated = updatedValues[key];

    if (key === 'dueDate') {
      const dbDate =
        original instanceof Date && original.toISOString().slice(0, 10);
      const updatedDate =
        updated instanceof Date && updated.toISOString().slice(0, 10);

      if (dbDate !== updatedDate) {
        updatedFields[key] = updated as Tickets[typeof key];
      }
    } else if (updated !== undefined && updated !== original) {
      updatedFields[key] = updated as Tickets[typeof key];
    }
  }
  return updatedFields;
}

export function getUpdatedBoardFields(originalBoard: any, values: any) {
  const updatedFields: any = {};
  for (const key of Object.keys(values)) {
    const original = originalBoard[key];
    const updated = values[key];
    if (original !== updated) {
      updatedFields[key] = updated;
    }
  }
  return updatedFields;
}

export function getUpdatedProjectFields(originalProject: any, values: any) {
  const updatedFields: any = {};
  for (const key of Object.keys(values)) {
    const original = originalProject[key];
    const updated = values[key];
    if (original !== updated) {
      updatedFields[key] = updated;
    }
  }
  return updatedFields;
}
