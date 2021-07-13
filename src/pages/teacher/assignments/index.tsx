import { Button, Table } from 'antd';
import { get } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { GetAssignments } from '~/gql/teacher/queries';
import { useAuth } from '~/hooks/useAuth';

const AssignmentList = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { current_teacher_id } = useAuth();
  const [assignments, setAssignments] = useState([]);

  const [{ data }] = useQuery({
    query: GetAssignments,
    requestPolicy: 'network-only',
    variables: { teacher_id: current_teacher_id },
    pause: !current_teacher_id,
  });

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
      <Button
        htmlType="button"
        className="float-right"
        type="primary"
        onClick={() => {
          router.push(`/teacher/assignments/new`);
        }}
      >
        Add
      </Button>
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
              router.push(`/teacher/assignments/${record?.id}`);
            },
          };
        }}
      />
    </>
  );
};

export default AssignmentList;
