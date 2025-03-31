import { memo } from 'react';
import { Form, Input, Button } from 'antd';

import { FormInstance } from 'antd';

interface CreateCommentFormProps {
  handleCreateComment: (_values: { content: string }) => Promise<void>;
  isCreating: boolean;
  form: FormInstance;
}

const CreateCommentForm = memo(function CreateCommentForm({
  handleCreateComment,
  isCreating,
  form,
}: CreateCommentFormProps) {
  return (
    <div>
      <Form onFinish={handleCreateComment} form={form}>
        <Form.Item label='Comment' name='content' style={{ display: 'grid' }}>
          <Input.TextArea
            placeholder='Enter your comment here'
            autoSize={{ minRows: 3 }}
            allowClear={true}
            showCount
            minLength={1}
            maxLength={200}
          />
        </Form.Item>
        <Form.Item label={null}>
          <Button variant='outlined' htmlType='submit' disabled={isCreating}>
            Add Comment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default CreateCommentForm;
