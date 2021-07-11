import { Card } from 'antd';
import { get } from 'lodash';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { AdminDashboardDetails } from '~/gql/admin/queries';

const gridStyle: CSSProperties = {
  width: '25%',
  textAlign: 'center',
  color: '#fff',
  borderRadius: 10,
  margin: 10,
};

const Admin = () => {
  const [details, setDetails] =
    useState<{ students: string; parents: string; teachers: string }>();
  const [{ data }] = useQuery({
    query: AdminDashboardDetails,
    requestPolicy: 'network-only',
  });

  useEffect(() => {
    if (data) {
      setDetails({
        students: get(data, 'students.aggregate.count'),
        teachers: get(data, 'teachers.aggregate.count'),
        parents: get(data, 'parents.aggregate.count'),
      });
    }
  }, [data]);

  return (
    <Card bordered={false} style={{ background: '#f9f9f9' }}>
      <div className="flex justify-center">
        <Card.Grid style={{ ...gridStyle, background: '#d81159' }}>
          <h5 style={{ color: '#fff' }}>Teachers</h5>
          <div style={{ fontSize: 50, fontWeight: 'bolder' }}>
            {details?.teachers}
          </div>
        </Card.Grid>
        <Card.Grid style={{ ...gridStyle, background: '#8f2d56' }}>
          <h5 style={{ color: '#fff' }}>Students</h5>
          <div style={{ fontSize: 50, fontWeight: 'bolder' }}>
            {details?.students}
          </div>
        </Card.Grid>
        <Card.Grid style={{ ...gridStyle, background: '#218380' }}>
          <h5 style={{ color: '#fff' }}>Parents</h5>
          <div style={{ fontSize: 50, fontWeight: 'bolder' }}>
            {details?.parents}
          </div>
        </Card.Grid>
      </div>
    </Card>
  );
};

export default Admin;
