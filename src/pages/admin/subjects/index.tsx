import { Button, Form, Input, Modal, Select, Table } from 'antd';
import { get } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import {
  AddSubject,
  DeleteSubject,
  UpdateSubject,
} from '~/gql/admin/mutations';
import { GetSubjects } from '~/gql/admin/queries';

const Subject = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<string>();
  const [initialValues, setInitialValues] =
    useState<{ id: string; semester_id: string; subject: string }>();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [{ data }, refetch] = useQuery({
    query: GetSubjects,
    requestPolicy: 'network-only',
  });

  const [, addSubject] = useMutation(AddSubject);
  const [, updateSubject] = useMutation(UpdateSubject);
  const [, deleteSubject] = useMutation(DeleteSubject);

  useEffect(() => {
    if (data) {
      setSemesters(get(data, 'semesters'));
      setSubjects(get(data, 'subjects'));
    }
  }, [data]);

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  const showAddModal = () => {
    setAction('Add');
    setIsModalVisible(true);
    setInitialValues({ id: '', semester_id: '', subject: '' });
  };

  const showEditModal = useCallback(
    (data) => {
      setAction('Edit');
      setIsModalVisible(true);
      setInitialValues({
        id: data.id,
        subject: data.subject,
        semester_id: data.semester?.id,
      });
    },
    [initialValues, action, subjects]
  );

  const reset = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    if (action === 'Add') {
      await addSubject({
        semester_id: values?.semester,
        subject: values?.subject,
      });
    } else {
      await updateSubject({
        id: initialValues?.id,
        semester_id: values?.semester,
        subject: values?.subject,
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
      title: 'Semester',
      dataIndex: 'semester',
      render: (record) => get(record, 'semester'),
      key: 'semester',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
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
        dataSource={subjects}
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
        title={`${action} semester`}
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
            name="semester"
            label="Semester"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              defaultValue={initialValues?.semester_id}
              style={{ width: 120 }}
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
          <Form.Item
            name="subject"
            label="Subject"
            rules={[
              {
                required: true,
                message: 'Please input a subject name!',
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
                  await deleteSubject({ id: initialValues?.id });
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

export default Subject;
