import { message } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { Dispatch, SetStateAction } from 'react';

export const beforeUpload = async (
  file: RcFile,
  setFile: Dispatch<SetStateAction<string | undefined>>
) => {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('File size must be less than 2MB!');
    return false;
  }
  const url = await getBase64(file);
  setFile(url as string);
  return isLt2M;
};

export const getBase64 = async (file: RcFile) => {
  if (file) {
    const data: string | ArrayBuffer = await new Promise((resolve) => {
      const reader = new FileReader();
      reader?.readAsDataURL(file);
      reader.onload = () => resolve(reader?.result as string);
    });
    return data;
  }
  return '';
};
