import { useCallback } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { Tickets } from '../types/Tickets';

type BoardState = Record<string, Tickets[]>; // Tickets is a type from TaskBoard.tsx

export function useDragHandler(
  setBoardState: React.Dispatch<React.SetStateAction<BoardState>>
) {
  const handleOnDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      if (!destination) return; // Ignore if dropped outside a droppable area

      // If the item is moved to the same position, do nothing
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      setBoardState((prev) => {
        // Clone only the affected board(s) instead of the entire state
        const sourceBoard = [...(prev[source.droppableId] || [])];

        // Ensure the item exists before moving
        if (!sourceBoard[source.index]) return prev;

        // Clone the ticket to avoid mutation
        const movedItem = { ...sourceBoard[source.index] };

        // Remove from the source board
        sourceBoard.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
          // Move inside the same board (reorder)
          sourceBoard.splice(destination.index, 0, movedItem);

          // Update the state for that board only
          const newState = {
            ...prev,
            [source.droppableId]: sourceBoard,
          };

          return newState;
        } else {
          // Moving to a different board
          const destinationBoard = [...(prev[destination.droppableId] || [])];
          movedItem.status = destination.droppableId as
            | 'BACKLOG'
            | 'IN_PROGRESS'
            | 'DONE';
          destinationBoard.splice(destination.index, 0, movedItem);

          // Set the new state with fresh references
          const newState = {
            ...prev,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: destinationBoard,
          };

          return newState;
        }
      });
    },
    [setBoardState]
  );

  return handleOnDragEnd;
}
