import { Button, Form, InputNumber, Modal, Select, Table } from 'antd';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import {
  AddAttendance,
  DeleteAttendance,
  UpdateAttendance,
} from '~/gql/teacher/mutation';
import { GetStudentAttendance } from '~/gql/teacher/queries';
import { useAuth } from '~/hooks/useAuth';

const Attendance = () => {
  const router = useRouter();
  const { subjectId } = router.query;
  const { current_teacher_id } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<string>();
  const [initialValues, setInitialValues] =
    useState<{ id: string; student_id: string; attendance: number }>();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [studentAttendances, setStudentAttendances] = useState([]);
  const [students, setStudents] = useState([]);

  const [{ data }, refetch] = useQuery({
    query: GetStudentAttendance,
    requestPolicy: 'network-only',
    variables: { subject_id: subjectId },
    pause: !subjectId,
  });

  const [, addAttendance] = useMutation(AddAttendance);
  const [, updateAttendance] = useMutation(UpdateAttendance);
  const [, deleteAttendance] = useMutation(DeleteAttendance);

  useEffect(() => {
    if (data) {
      setStudentAttendances(get(data, 'attendances'));
      setStudents(get(data, 'student_subjects'));
    }
  }, [data]);

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  const showAddModal = () => {
    setAction('Add');
    setIsModalVisible(true);
    setInitialValues({ id: '', student_id: '', attendance: 0 });
  };

  const showEditModal = useCallback(
    (data) => {
      setAction('Edit');
      setIsModalVisible(true);
      setInitialValues({
        id: data.id,
        attendance: data.attendance,
        student_id: data.student?.id,
      });
    },
    [initialValues, action, students]
  );

  const reset = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    if (action === 'Add') {
      await addAttendance({
        teacher_id: current_teacher_id,
        subject_id: subjectId,
        student_id: values?.student_id,
        attendance: values?.attendance,
      });
    } else {
      await updateAttendance({
        id: initialValues?.id,
        student_id: values?.student_id,
        attendance: values?.attendance,
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
      title: 'Student',
      dataIndex: 'student',
      render: (record) => get(record, 'user.name'),
      key: 'student',
    },
    {
      title: 'Attendance',
      dataIndex: 'attendance',
      key: 'attendance',
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
        dataSource={studentAttendances}
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
        title={`${action} student`}
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
            name="student_id"
            label="Student"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              defaultValue={initialValues?.student_id}
              style={{ width: 200 }}
            >
              <Option disabled value="">
                Select
              </Option>
              {students.map(({ student: { user, id } }) => (
                <Option key={`dep${id}`} value={id}>
                  {get(user, 'name')}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="attendance"
            label="Attendance"
            rules={[
              {
                required: true,
                message: 'Please input a attendance!',
              },
            ]}
          >
            <InputNumber />
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
                  await deleteAttendance({ id: initialValues?.id });
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

export default Attendance;
