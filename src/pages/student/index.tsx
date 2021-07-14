import { Card } from 'antd';
import { get } from 'lodash';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { GetStudentDetails, StudentDashboard } from '~/gql/student/queries';
import { useAuth } from '~/hooks/useAuth';

const gridStyle: CSSProperties = {
  width: '25%',
  textAlign: 'center',
  color: '#fff',
  borderRadius: 10,
  margin: 10,
};

const Student = () => {
  const { current_student_id } = useAuth();
  const [semesterId, setSemesterId] = useState('');
  const [details, setDetails] =
    useState<{ total: number; submitted: number; pending: number }>();

  const [{ data: semesters }] = useQuery({
    query: GetStudentDetails,
    requestPolicy: 'network-only',
    variables: { student_id: current_student_id },
    pause: !current_student_id,
  });
  const [{ data }] = useQuery({
    query: StudentDashboard,
    requestPolicy: 'network-only',
    variables: { semester_id: semesterId, student_id: current_student_id },
    pause: !(semesterId && current_student_id),
  });

  useEffect(() => {
    if (semesters) {
      setSemesterId(get(semesters, 'students.0.semester_id'));
    }
  }, [semesters]);

  useEffect(() => {
    if (data) {
      setDetails({
        total: get(data, 'total_assignment.aggregate.count'),
        submitted: get(data, 'submitted_assignment.aggregate.count'),
        pending:
          get(data, 'total_assignment.aggregate.count') -
          get(data, 'submitted_assignment.aggregate.count'),
      });
    }
  }, [data]);

  return (
    <Card bordered={false} style={{ background: '#f9f9f9' }}>
      <div className="flex justify-center">
        <Card.Grid style={{ ...gridStyle, background: '#d81159' }}>
          <h5 style={{ color: '#fff' }}>Total Assignment</h5>
          <div style={{ fontSize: 50, fontWeight: 'bolder' }}>
            {details?.total}
          </div>
        </Card.Grid>
        <Card.Grid style={{ ...gridStyle, background: '#8f2d56' }}>
          <h5 style={{ color: '#fff' }}>Submitted Assignment</h5>
          <div style={{ fontSize: 50, fontWeight: 'bolder' }}>
            {details?.submitted}
          </div>
        </Card.Grid>
        <Card.Grid style={{ ...gridStyle, background: '#218380' }}>
          <h5 style={{ color: '#fff' }}>Pending Assignment</h5>
          <div style={{ fontSize: 50, fontWeight: 'bolder' }}>
            {details?.pending}
          </div>
        </Card.Grid>
      </div>
    </Card>
  );
};

export default Student;
