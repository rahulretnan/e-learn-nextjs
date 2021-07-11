import { Button, Form, Input, Modal, Select, Table } from 'antd';
import { get } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import { AddCourse, DeleteCourse, UpdateCourse } from '~/gql/admin/mutations';
import { GetCourses } from '~/gql/admin/queries';

const Course = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<string>();
  const [initialValues, setInitialValues] =
    useState<{ id: string; department_id: string; course: string }>();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [{ data }, refetch] = useQuery({
    query: GetCourses,
    requestPolicy: 'network-only',
  });

  const [, addCourse] = useMutation(AddCourse);
  const [, updateCourse] = useMutation(UpdateCourse);
  const [, deleteCourse] = useMutation(DeleteCourse);

  useEffect(() => {
    if (data) {
      setDepartments(get(data, 'departments'));
      setCourses(get(data, 'courses'));
    }
  }, [data]);

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  const showAddModal = () => {
    setAction('Add');
    setIsModalVisible(true);
    setInitialValues({ course: '', id: '', department_id: '' });
  };

  const showEditModal = useCallback(
    (data) => {
      setAction('Edit');
      setIsModalVisible(true);
      setInitialValues({
        id: data.id,
        course: data.course,
        department_id: data.department?.id,
      });
    },
    [initialValues, action, courses]
  );

  const reset = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    if (action === 'Add') {
      await addCourse({
        department_id: values?.department,
        course: values?.course,
      });
    } else {
      await updateCourse({
        id: initialValues?.id,
        department_id: values?.department,
        course: values?.course,
      });
    }
    refetch({ requestPolicy: 'network-only' });
    reset();
  };
  const columns = [
    {
      title: 'Sl No.',
      key: 'index',
      render: (value, item, index) => (page - 1) * 10 + index + 1,
      width: 50,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      render: (record) => get(record, 'department'),
      key: 'department',
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
    },
  ];

  return (
    <>
      <Button
        htmlType="button"
        className="float-right"
        type="primary"
        onClick={showAddModal}
      >
        Add
      </Button>
      <Table
        bordered
        dataSource={courses}
        columns={columns}
        pagination={{
          onChange(current) {
            setPage(current);
          },
        }}
        onRow={(record) => {
          return {
            onClick: () => showEditModal(record),
          };
        }}
      />
      <Modal
        title={`${action} department`}
        visible={isModalVisible}
        footer={null}
        onCancel={reset}
      >
        <Form
          className="text-left"
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
          initialValues={initialValues}
        >
          <Form.Item
            name="department"
            label="Department"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              defaultValue={initialValues?.department_id}
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
            name="course"
            label="Course"
            rules={[
              {
                required: true,
                message: 'Please input a course name!',
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {`${action === 'Add' ? 'Save' : 'Update'}`}
            </Button>
            {action !== 'Add' ? (
              <Button
                htmlType="button"
                className="float-right"
                danger
                onClick={async () => {
                  await deleteCourse({ id: initialValues?.id });
                  refetch();
                  reset();
                }}
              >
                Delete
              </Button>
            ) : (
              ''
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Course;
