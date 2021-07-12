import { Button, DatePicker, Form, Input, Select } from 'antd';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import { AddAssignment } from '~/gql/teacher/mutation';
import { GetAssignmentFormDetails } from '~/gql/teacher/queries';
import { useAuth } from '~/hooks/useAuth';

export const AssignmentForm = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { setLoading, current_teacher_id } = useAuth();
  const { Option } = Select;
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [{ data }] = useQuery({
    query: GetAssignmentFormDetails,
    requestPolicy: 'network-only',
  });

  const [, addAssignment] = useMutation(AddAssignment);

  useEffect(() => {
    if (data) {
      setSemesters(get(data, 'semesters'));
      setSubjects(get(data, 'subjects'));
    }
  }, [data]);

  const onFinish = async (values) => {
    setLoading(true);
    await addAssignment({ ...values, teacher_id: current_teacher_id });
    form.resetFields();
    setLoading(false);
    router.push('/teacher/assignments');
  };

  return (
    <Form
      className="text-left"
      form={form}
      name="register"
      onFinish={onFinish}
      layout="vertical"
      scrollToFirstError
    >
      <Form.Item
        name="semester_id"
        label="Semester"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select defaultValue="" style={{ width: 120 }}>
          <Option disabled value="">
            Select
          </Option>
          {semesters.map(({ semester, id }) => (
            <Option key={`dep${id}`} value={id}>
              {semester}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="subject_id"
        label="Subject"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select defaultValue="" style={{ width: 120 }}>
          <Option disabled value="">
            Select
          </Option>
          {subjects.map(({ subject, id }) => (
            <Option key={`dep${id}`} value={id}>
              {subject}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="assignment"
        label="Assignment"
        rules={[
          {
            type: 'string',
            required: true,
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="last_date"
        label="Last date to submit"
        rules={[
          {
            type: 'date',
            required: true,
          },
        ]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};
