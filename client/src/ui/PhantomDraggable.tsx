import { Card } from 'antd';
import { Draggable } from '@hello-pangea/dnd';

function PhantomDraggable({
  boardId,
  isDraggingOver,
}: {
  boardId: string;
  isDraggingOver: boolean;
}) {
  return (
    <Draggable draggableId={`phatom-${boardId}`} index={0} isDragDisabled>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            height: '72px', // Match real ticket height
            width: '100%',
            backgroundColor: '#f0f0f0',
            borderRadius: '6px',
            opacity: isDraggingOver ? 0 : 0.01, // Slight visibility for user clarity
            border: '1px dashed #ccc',
            pointerEvents: 'none', // Non-interactable
            ...provided.draggableProps.style,
          }}
        >
          <Card bordered={false} style={{ display: 'none' }}>
            Drop Tasks Here
          </Card>
        </div>
      )}
    </Draggable>
  );
}

export default PhantomDraggable;
