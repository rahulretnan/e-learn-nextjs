import { Button, Table } from 'antd';
import { get } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { GetAssignments, GetStudentDetails } from '~/gql/student/queries';
import { useAuth } from '~/hooks/useAuth';

const AssignmentList = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { current_student_id } = useAuth();
  const [semesterId, setSemesterId] = useState('');
  const [assignments, setAssignments] = useState([]);

  const [{ data }] = useQuery({
    query: GetAssignments,
    requestPolicy: 'network-only',
    variables: { semester_id: semesterId },
    pause: !semesterId,
  });
  const [{ data: semester }] = useQuery({
    query: GetStudentDetails,
    requestPolicy: 'network-only',
    variables: { student_id: current_student_id },
    pause: !current_student_id,
  });

  useEffect(() => {
    if (semester) {
      setSemesterId(get(semester, 'students.0.semester_id'));
    }
  }, [semester]);

  useEffect(() => {
    if (data) {
      setAssignments(get(data, 'assignments'));
    }
  }, [data]);

  const columns = [
    {
      title: 'Sl No.',
      key: 'index',
      render: (value, item, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Assignment',
      dataIndex: 'assignment',
      width: '25%',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      render: (record) => get(record, 'subject'),
      width: '25%',
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      render: (record) => moment(record).format('ll'),
    },
    {
      title: 'Last Date of Submission',
      dataIndex: 'last_date',
      render: (record) => moment(record).format('ll'),
    },
  ];

  return (
    <>
      <Table
        bordered
        rowKey={(record) => record?.id}
        dataSource={assignments}
        columns={columns}
        pagination={{
          onChange(current) {
            setPage(current);
          },
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              router.push(`/student/assignments/${record?.id}`);
            },
          };
        }}
      />
    </>
  );
};

export default AssignmentList;
