import { message } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { Dispatch, SetStateAction } from 'react';

export const beforeUpload = (
  file: RcFile,
  setFile: Dispatch<SetStateAction<RcFile | undefined>>
) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('Only upload JPG or PNG files!');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image size must be less than 2MB!');
    return false;
  }
  setFile(file);
  return isJpgOrPng && isLt2M;
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
