import { gql } from 'urql/core';

export const UploadAssignment = gql`
  mutation uploadAssignment(
    $assignment_id: uuid
    $file: String
    $student_id: uuid
  ) {
    insert_student_assignments(
      objects: {
        assignment_id: $assignment_id
        file: $file
        student_id: $student_id
      }
    ) {
      affected_rows
    }
  }
`;
