import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Select,
  Upload,
} from 'antd';
import { get, omit } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import { UpdateStudentDepartment } from '~/gql/admin/mutations';
import {
  GetCoursesByDepartment,
  GetDepartments,
  GetSemestersByCourse,
} from '~/gql/admin/queries';
import { beforeUpload } from '~/helpers/file-uploader';
import { useAuth } from '~/hooks/useAuth';
import { TStudent } from '~/shared/types';

export const StudentForm = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { setLoading, register } = useAuth();
  const { Option } = Select;
  const [file, setFile] = useState<string>();
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [departmentId, setDepartmentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semesterId, setSemesterId] = useState('');

  const [{ data: department }] = useQuery({
    query: GetDepartments,
    requestPolicy: 'network-only',
  });
  const [{ data: course }] = useQuery({
    query: GetCoursesByDepartment,
    requestPolicy: 'network-only',
    variables: { department_id: departmentId },
    pause: !departmentId,
  });
  const [{ data: semester }] = useQuery({
    query: GetSemestersByCourse,
    requestPolicy: 'network-only',
    variables: { course_id: courseId },
    pause: !courseId,
  });

  const [, updateStudentDepartment] = useMutation(UpdateStudentDepartment);

  useEffect(() => {
    if (department) {
      setDepartments(get(department, 'departments'));
    }
  }, [department]);

  useEffect(() => {
    if (course) {
      setCourses(get(course, 'courses'));
    }
  }, [course]);

  useEffect(() => {
    if (semester) {
      setSemesters(get(semester, 'semesters'));
    }
  }, [semester]);

  const onFinish = async (values: TStudent) => {
    setLoading(true);
    const newData = omit(values, [
      'confirm',
      'department_id',
      'course_id',
      'semester_id',
    ]);
    const formData = {
      ...newData,
      role: 'STUDENT',
      profile_picture: file,
    };

    const { data: user } = await register(formData);
    if (user)
      await updateStudentDepartment({
        user_id: user?.id,
        department_id: values?.department_id,
        course_id: values?.course_id,
        semester_id: values?.semester_id,
      });
    form.resetFields();
    setLoading(false);
    router.push('/admin/students');
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
            <Select
              defaultValue=""
              onChange={(value) => {
                setCourseId('');
                setCourses([]);
                setSemesters([]);
                setSemesterId('');
                form.setFieldsValue({ course_id: '', semester_id: '' });
                setDepartmentId(value);
              }}
              style={{ width: 120 }}
            >
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
          <Form.Item
            name="course_id"
            label="Course"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              defaultValue=""
              disabled={courses.length === 0}
              value={courseId}
              onChange={(value) => {
                setSemesters([]);
                form.setFieldsValue({ semester_id: '' });
                setCourseId(value);
              }}
              style={{ width: 120 }}
            >
              <Option disabled value="">
                Select
              </Option>
              {courses.map(({ course, id }) => (
                <Option key={`dep${id}`} value={id}>
                  {course}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="semester_id"
            label="Semester"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              disabled={semesters.length === 0}
              defaultValue=""
              value={semesterId}
              style={{ width: 120 }}
              onChange={(value) => {
                setSemesterId(value);
              }}
            >
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
        </div>
      </div>

      <Form.Item label="Profile Picture" valuePropName="fileList">
        <Upload
          beforeUpload={(file) => {
            beforeUpload(file, setFile);
          }}
          onRemove={() => setFile(undefined)}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        {file ? <Image src={file || ''} alt="image" width={100} /> : ''}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};
