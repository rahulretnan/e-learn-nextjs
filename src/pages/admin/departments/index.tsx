import { Button, Form, Input, Modal, Table } from 'antd';
import { get } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import {
  AddDepartment,
  DeleteDepartment,
  UpdateDepartment,
} from '~/gql/admin/mutations';
import { GetDepartments } from '~/gql/admin/queries';

const Department = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<string>('Add');
  const [initialValues, setInitialValues] =
    useState<{ id: string; department: string }>();

  const [departments, setDepartments] = useState([]);

  const [{ data }, refetch] = useQuery({
    query: GetDepartments,
    requestPolicy: 'network-only',
  });

  const [, addDepartment] = useMutation(AddDepartment);
  const [, updateDepartment] = useMutation(UpdateDepartment);
  const [, deleteDepartment] = useMutation(DeleteDepartment);

  useEffect(() => {
    if (data) {
      setDepartments(get(data, 'departments'));
    }
  }, [data]);

  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  const showAddModal = () => {
    setAction('Add');
    setIsModalVisible(true);
    setInitialValues({ department: '', id: '' });
  };

  const showEditModal = useCallback(
    (data) => {
      setAction('Edit');
      setIsModalVisible(true);
      setInitialValues({
        id: data.id,
        department: data.department,
      });
    },
    [initialValues, action, departments]
  );

  const reset = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    if (action === 'Add') {
      await addDepartment({ department: values?.department });
    } else {
      await updateDepartment({
        id: initialValues?.id,
        department: values?.department,
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
      key: 'department',
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
        dataSource={departments}
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
                message: 'Please input a department name!',
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
                  await deleteDepartment({ id: initialValues?.id });
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

export default Department;
