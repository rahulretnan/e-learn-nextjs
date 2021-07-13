/* eslint-disable react/display-name */
import { DownloadOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { get } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { getStudentAssignments } from '~/gql/teacher/queries';

const StudentAssignmentList = () => {
  const router = useRouter();
  const { assignmentId } = router.query;
  const [page, setPage] = useState(1);
  const [studentAssignments, setStudentAssignment] = useState([]);

  const [{ data }] = useQuery({
    query: getStudentAssignments,
    requestPolicy: 'network-only',
    variables: { assignment_id: assignmentId },
    pause: !assignmentId,
  });

  useEffect(() => {
    if (data) {
      setStudentAssignment(get(data, 'student_assignments'));
    }
  }, [data]);

  const columns = [
    {
      title: 'Sl No.',
      key: 'index',
      render: (value, item, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Student Name',
      dataIndex: 'student',
      render: (record) => get(record, 'user.name'),
      width: '25%',
    },
    {
      title: 'Semester',
      dataIndex: 'student',
      render: (record) => get(record, 'semester.semester'),
    },
    {
      title: 'Submitted Date',
      dataIndex: 'created_at',
      render: (record) => moment(record).format('ll'),
    },
    {
      title: 'Assignment',
      dataIndex: 'file',
      render: (record) => (
        <a href={record} target="_blank" rel="noreferrer">
          <DownloadOutlined />
        </a>
      ),
    },
  ];

  return (
    <Table
      bordered
      rowKey={(record) => record?.id}
      dataSource={studentAssignments}
      columns={columns}
      pagination={{
        onChange(current) {
          setPage(current);
        },
      }}
    />
  );
};

export default StudentAssignmentList;
