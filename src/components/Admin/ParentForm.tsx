import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { get, omit } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import { UpdateParentStudent } from '~/gql/admin/mutations';
import { GetStudents } from '~/gql/admin/queries';
import { beforeUpload, getBase64 } from '~/helpers/file-uploader';
import { useAuth } from '~/hooks/useAuth';
import { TParent } from '~/shared/types';

export const ParentForm = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { setLoading, register } = useAuth();
  const { Option } = Select;
  const [file, setFile] = useState<RcFile>();
  const [students, setStudents] = useState([]);
  const [{ data }] = useQuery({
    query: GetStudents,
    requestPolicy: 'network-only',
  });

  const [, updateParentStudent] = useMutation(UpdateParentStudent);

  useEffect(() => {
    if (data) {
      setStudents(get(data, 'students'));
    }
  }, [data]);

  const onFinish = async (values: TParent) => {
    setLoading(true);
    const newData = omit(values, ['confirm', 'student_id']);
    const formData = {
      ...newData,
      role: 'PARENT',
      profile_picture: await getBase64(file as RcFile),
    };

    const { data: user } = await register(formData);
    if (user)
      await updateParentStudent({
        user_id: user?.id,
        student_id: values?.student_id,
      });
    form.resetFields();
    setLoading(false);
    router.push('/admin/parents');
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
      <div className="row">
        <div className="col-6">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: 'Please input your Name!',
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      'The two passwords that you entered do not match!'
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              {
                type: 'string',
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select defaultValue="select" style={{ width: 120 }}>
              <Option disabled value="select">
                Select
              </Option>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </Form.Item>
        </div>
        <div className="col-6">
          <Form.Item
            name="address"
            label="Address"
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
            name="student_id"
            label="Student"
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
              {students.map(({ user, id }) => (
                <Option key={`dep${id}`} value={id}>
                  {get(user, 'name')}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>

      <Form.Item label="Profile Picture" valuePropName="fileList">
        <Upload
          beforeUpload={(file) => {
            beforeUpload(file, setFile);
          }}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};
