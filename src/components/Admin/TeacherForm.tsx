import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from 'antd';
import { RcFile } from 'antd/lib/upload';
import { get, omit } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import { UpdateTeacherDepartment } from '~/gql/admin/mutations';
import { GetDepartments } from '~/gql/admin/queries';
import { beforeUpload, getBase64 } from '~/helpers/file-uploader';
import { useAuth } from '~/hooks/useAuth';
import { TTeacher } from '~/shared/types';

export const TeacherForm = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { setLoading, register } = useAuth();
  const { Option } = Select;
  const [file, setFile] = useState<RcFile>();
  const [departments, setDepartments] = useState([]);
  const [{ data }] = useQuery({
    query: GetDepartments,
    requestPolicy: 'network-only',
  });

  const [, updateTeacherDepartment] = useMutation(UpdateTeacherDepartment);

  useEffect(() => {
    if (data) {
      setDepartments(get(data, 'departments'));
    }
  }, [data]);
  const onFinish = async (values: TTeacher) => {
    setLoading(true);
    const newData = omit(values, ['confirm', 'department_id']);
    const formData = {
      ...newData,
      role: 'TEACHER',
      profile_picture: await getBase64(file as RcFile),
    };

    const { data: user } = await register(formData);
    if (user)
      await updateTeacherDepartment({
        user_id: user?.id,
        department_id: values?.department_id,
      });
    form.resetFields();
    setLoading(false);
    router.push('/admin/teachers');
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
            name="age"
            label="Age"
            rules={[
              {
                type: 'number',
                required: true,
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="dob"
            label="Date of birth"
            rules={[
              {
                type: 'date',
                required: true,
              },
            ]}
          >
            <DatePicker />
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
            name="category"
            label="Category"
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
            name="religion"
            label="Religion"
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
            name="father_name"
            label="Father's Name"
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
            name="mother_name"
            label="Mother's Name"
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
            name="guardian"
            label="Guardian"
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
            name="nationality"
            label="Nationality"
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
            name="qualification"
            label="Highest qualification"
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
            name="department_id"
            label="Department"
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
              {departments.map(({ department, id }) => (
                <Option key={`dep${id}`} value={id}>
                  {department}
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
