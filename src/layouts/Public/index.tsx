import React from 'react';
import { TProps } from '~/shared/types';

const PublicLayout = ({ children }: TProps<any>) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      {children}
    </div>
  );
};

export default PublicLayout;
