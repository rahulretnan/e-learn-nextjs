import { Button, Form, Input, Modal, Select, Table } from 'antd';
import { get } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import {
  AddSemester,
  DeleteSemester,
  UpdateSemester,
} from '~/gql/admin/mutations';
import { GetSemesters } from '~/gql/admin/queries';

const Semester = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<string>();
  const [initialValues, setInitialValues] =
    useState<{ id: string; course_id: string; semester: string }>();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [{ data }, refetch] = useQuery({
    query: GetSemesters,
    requestPolicy: 'network-only',
  });

  const [, addSemester] = useMutation(AddSemester);
  const [, updateSemester] = useMutation(UpdateSemester);
  const [, deleteSemester] = useMutation(DeleteSemester);

  useEffect(() => {
    if (data) {
      setCourses(get(data, 'courses'));
      setSemesters(get(data, 'semesters'));
    }
  }, [data]);

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  const showAddModal = () => {
    setAction('Add');
    setIsModalVisible(true);
    setInitialValues({ id: '', course_id: '', semester: '' });
  };

  const showEditModal = useCallback(
    (data) => {
      setAction('Edit');
      setIsModalVisible(true);
      setInitialValues({
        id: data.id,
        semester: data.semester,
        course_id: data.course?.id,
      });
    },
    [initialValues, action, semesters]
  );

  const reset = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    if (action === 'Add') {
      await addSemester({
        course_id: values?.course,
        semester: values?.semester,
      });
    } else {
      await updateSemester({
        id: initialValues?.id,
        course_id: values?.course,
        semester: values?.semester,
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
      title: 'Course',
      dataIndex: 'course',
      render: (record) => get(record, 'course'),
      key: 'course',
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
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
        dataSource={semesters}
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
        title={`${action} course`}
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
            name="course"
            label="Course"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              defaultValue={initialValues?.course_id}
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
            name="semester"
            label="Semester"
            rules={[
              {
                required: true,
                message: 'Please input a semester name!',
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
                  await deleteSemester({ id: initialValues?.id });
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

export default Semester;
