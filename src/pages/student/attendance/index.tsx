import { Select, Table } from 'antd';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { GetAttendance, GetStudentDetails } from '~/gql/student/queries';
import { useAuth } from '~/hooks/useAuth';

const Attendance = () => {
  const router = useRouter();
  const { current_student_id } = useAuth();
  const [page, setPage] = useState(1);
  const [semesterId, setSemesterId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const { Option } = Select;

  const [{ data: semesters }] = useQuery({
    query: GetStudentDetails,
    requestPolicy: 'network-only',
    variables: { student_id: current_student_id },
    pause: !current_student_id,
  });

  const [{ data }] = useQuery({
    query: GetAttendance,
    requestPolicy: 'network-only',
    variables: { semester_id: semesterId, student_id: current_student_id },
    pause: !semesterId && !current_student_id,
  });

  useEffect(() => {
    if (semesters) {
      setSemesterId(get(semesters, 'students.0.semester_id'));
    }
  }, [semesters]);

  useEffect(() => {
    if (data) {
      setSubjects(get(data, 'subjects'));
    }
  }, [data]);

  const columns = [
    {
      title: 'Sl No.',
      key: 'index',
      render: (value, item, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
    },
    {
      title: 'Attendance',
      dataIndex: 'attendances',
      render: (record) => get(record, '0.attendance'),
    },
  ];

  return (
    <Table
      bordered
      rowKey={(record) => record?.id}
      dataSource={subjects}
      columns={columns}
      pagination={{
        onChange(current) {
          setPage(current);
        },
      }}
    />
  );
};

export default Attendance;
