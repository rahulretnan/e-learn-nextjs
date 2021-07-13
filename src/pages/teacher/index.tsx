import { Card } from 'antd';
import { get } from 'lodash';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { TeacherDashboardDetails } from '~/gql/teacher/queries';
import { useAuth } from '~/hooks/useAuth';

const gridStyle: CSSProperties = {
  width: '25%',
  textAlign: 'center',
  color: '#fff',
  borderRadius: 10,
  margin: 10,
};

const Teacher = () => {
  const { current_teacher_id } = useAuth();
  const [details, setDetails] =
    useState<{ students: string; assignments: string }>();
  const [{ data }] = useQuery({
    query: TeacherDashboardDetails,
    requestPolicy: 'network-only',
    variables: { teacher_id: current_teacher_id },
  });

  useEffect(() => {
    if (data) {
      setDetails({
        students: get(data, 'students_aggregate.aggregate.count'),
        assignments: get(data, 'assignments_aggregate.aggregate.count'),
      });
    }
  }, [data]);

  return (
    <Card bordered={false} style={{ background: '#f9f9f9' }}>
      <div className="flex justify-center">
        <Card.Grid style={{ ...gridStyle, background: '#d81159' }}>
          <h5 style={{ color: '#fff' }}>Assignments</h5>
          <div style={{ fontSize: 50, fontWeight: 'bolder' }}>
            {details?.assignments}
          </div>
        </Card.Grid>
        <Card.Grid style={{ ...gridStyle, background: '#8f2d56' }}>
          <h5 style={{ color: '#fff' }}>Students</h5>
          <div style={{ fontSize: 50, fontWeight: 'bolder' }}>
            {details?.students}
          </div>
        </Card.Grid>
      </div>
    </Card>
  );
};

export default Teacher;
