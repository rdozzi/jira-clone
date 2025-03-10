import { Card } from 'antd';

function PhantomTaskCard({
  isVisible,
  isDraggingOver,
}: {
  isVisible: boolean;
  isDraggingOver: boolean;
}) {
  return (
    <Card
      bordered={false}
      size='default'
      style={{
        width: '100%',
        backgroundColor: isDraggingOver ? 'transparent' : '#f5f5f5',
        borderRadius: '6px',
        display: isVisible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isDraggingOver ? 0 : isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: 'none',
        border: isDraggingOver ? 'none' : '1px dashed #ccc',
      }}
    >
      Drop Tasks Here
    </Card>
  );
}

export default PhantomTaskCard;
