import { Attachment } from '../types/Attachments';
import { Button, Flex } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';

function editFilename(fileName: string) {
  const dashIndex = fileName.indexOf('-', 0);
  const updatedFilename = fileName.slice(dashIndex, fileName.length);
  return updatedFilename;
}

function AttachmentRow({ attachment }: { attachment: Attachment }) {
  return (
    <Flex justify='center' align='center' gap='small'>
      <div>{editFilename(attachment.fileName)}</div>
      <Button icon={<DownloadOutlined />} />
      <Button icon={<DeleteOutlined />} />
    </Flex>
  );
}

export default AttachmentRow;
