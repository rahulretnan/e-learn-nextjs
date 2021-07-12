import { Spin } from 'antd';
import React from 'react';

export const Spinner = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Spin style={{ margin: 'auto' }} />
    </div>
  );
};
