/* eslint-disable react/display-name */
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Upload } from 'antd';
import { get } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import { UploadAssignment } from '~/gql/student/mutations';
import { GetAssignmentById } from '~/gql/student/queries';
import { beforeUpload } from '~/helpers/file-uploader';
import { useAuth } from '~/hooks/useAuth';

const StudentAssignmentList = () => {
  const router = useRouter();
  const { assignmentId } = router.query;
  const { current_student_id } = useAuth();
  const [studentAssignment, setStudentAssignment] = useState<any>();
  const [file, setFile] = useState<string>();

  const [{ data }] = useQuery({
    query: GetAssignmentById,
    requestPolicy: 'network-only',
    variables: { id: assignmentId },
    pause: !assignmentId,
  });

  const [, uploadAssignment] = useMutation(UploadAssignment);
  useEffect(() => {
    if (data) {
      setStudentAssignment(get(data, 'assignments_by_pk'));
    }
  }, [data]);

  return (
    <Card className="text-center">
      <div>Assignment : {studentAssignment?.assignment}</div>
      <div>
        Created At : {moment(studentAssignment?.created_at).format('ll')}
      </div>
      <div>
        Last for submission :{' '}
        {moment(studentAssignment?.last_date).format('ll')}
      </div>
      <Upload
        beforeUpload={(file) => {
          beforeUpload(file, setFile);
        }}
        onRemove={() => setFile(undefined)}
      >
        <Button className="m-4" icon={<UploadOutlined />}>
          Click to Upload
        </Button>
      </Upload>
      <Button
        onClick={async () => {
          await uploadAssignment({
            assignment_id: assignmentId,
            student_id: current_student_id,
            file,
          });
          router.push('/student/assignments');
        }}
        className="m-4"
        type="primary"
        disabled={!file}
      >
        Save
      </Button>
    </Card>
  );
};

export default StudentAssignmentList;
