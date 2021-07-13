import { Select, Table } from 'antd';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import {
  getSubjectBySemester,
  GetTeacherSemester,
} from '~/gql/teacher/queries';
import { useAuth } from '~/hooks/useAuth';

const TeacherList = () => {
  const router = useRouter();
  const { current_teacher_id } = useAuth();
  const [page, setPage] = useState(1);
  const [teacherSemesters, setTeacherSemesters] = useState([]);
  const [semesterId, setSemesterId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const { Option } = Select;

  const [{ data: semesters }] = useQuery({
    query: GetTeacherSemester,
    requestPolicy: 'network-only',
    variables: { teacher_id: current_teacher_id },
  });
  const [{ data }] = useQuery({
    query: getSubjectBySemester,
    requestPolicy: 'network-only',
    variables: { semester_id: semesterId },
    pause: !semesterId,
  });

  useEffect(() => {
    if (semesters) {
      setTeacherSemesters(get(semesters, 'teacher_semesters'));
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
  ];

  return (
    <>
      <Select
        style={{ width: 120 }}
        value={semesterId}
        onChange={(value) => setSemesterId(value)}
      >
        <Option disabled value="">
          Select
        </Option>
        {teacherSemesters.map(({ semester: { semester, id } }) => (
          <Option key={`dep${id}`} value={id}>
            {semester}
          </Option>
        ))}
      </Select>
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
        onRow={(record) => {
          return {
            onClick: () => {
              router.push(`/teacher/attendances/${record?.id}`);
            },
          };
        }}
      />
    </>
  );
};

export default TeacherList;
