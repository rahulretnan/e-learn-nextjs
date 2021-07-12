import { Button, Table } from 'antd';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { GetParents } from '~/gql/admin/queries';

const ParentList = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [parents, setParents] = useState([]);

  const [{ data }] = useQuery({
    query: GetParents,
    requestPolicy: 'network-only',
  });

  useEffect(() => {
    if (data) {
      setParents(get(data, 'parents'));
    }
  }, [data]);

  const columns = [
    {
      title: 'Sl No.',
      key: 'index',
      render: (value, item, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'user',
      render: (record) => get(record, 'name'),
      width: '25%',
    },
    {
      title: 'Email',
      dataIndex: 'user',
      render: (record) => get(record, 'email'),
    },
    {
      title: 'Phone',
      dataIndex: 'user',
      render: (record) => get(record, 'user_details.0.phone'),
    },
  ];

  return (
    <>
      <Button
        htmlType="button"
        className="float-right"
        type="primary"
        onClick={() => {
          router.push(`/admin/parents/new`);
        }}
      >
        Add
      </Button>
      <Table
        bordered
        rowKey={(record) => record?.id}
        dataSource={parents}
        columns={columns}
        pagination={{
          onChange(current) {
            setPage(current);
          },
        }}
        // onRow={(record) => {
        //   return {
        //     onClick: () => {
        //       router.push(`/admin/parents/${record?.id}/edit`);
        //     },
        //   };
        // }}
      />
    </>
  );
};

export default ParentList;
