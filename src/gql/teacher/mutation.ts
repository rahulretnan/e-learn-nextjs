import { gql } from 'urql';

export const AddAssignment = gql`
  mutation addAssignment(
    $assignment: String
    $last_date: date
    $subject_id: uuid
    $semester_id: uuid
    $teacher_id: uuid
  ) {
    insert_assignments(
      objects: {
        assignment: $assignment
        last_date: $last_date
        subject_id: $subject_id
        semester_id: $semester_id
        teacher_id: $teacher_id
      }
    ) {
      affected_rows
    }
  }
`;
