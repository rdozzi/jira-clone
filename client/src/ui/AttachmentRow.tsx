import { Attachment } from '../types/Attachments';
import { Button, Flex } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';

function editFilename(fileName: string) {
  const dashIndex = fileName.indexOf('-', 0);
  const updatedFilename = fileName.slice(dashIndex + 1, fileName.length);
  return updatedFilename;
}

function AttachmentRow({ attachment }: { attachment: Attachment }) {
  return (
    <Flex justify='flex-start' align='center' gap='small'>
      {editFilename(attachment.fileName)}
      <Button icon={<DownloadOutlined />} />
      <Button icon={<DeleteOutlined />} />
    </Flex>
  );
}

export default AttachmentRow;
