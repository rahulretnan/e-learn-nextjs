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

export const AddAttendance = gql`
  mutation addAttendance(
    $teacher_id: uuid
    $subject_id: uuid
    $student_id: uuid
    $attendance: numeric
  ) {
    insert_attendances(
      objects: {
        teacher_id: $teacher_id
        subject_id: $subject_id
        student_id: $student_id
        attendance: $attendance
      }
    ) {
      affected_rows
    }
  }
`;

export const UpdateAttendance = gql`
  mutation updateAttendance(
    $id: uuid!
    $student_id: uuid
    $attendance: String
  ) {
    update_attendances_by_pk(
      pk_columns: { id: $id }
      _set: { student_id: $student_id, attendance: $attendance }
    ) {
      id
    }
  }
`;

export const DeleteAttendance = gql`
  mutation deleteAttendance($id: uuid!) {
    delete_attendances_by_pk(id: $id) {
      id
    }
  }
`;

export const AddMark = gql`
  mutation addMark(
    $teacher_id: uuid
    $subject_id: uuid
    $student_id: uuid
    $mark: numeric
  ) {
    insert_marks(
      objects: {
        teacher_id: $teacher_id
        subject_id: $subject_id
        student_id: $student_id
        mark: $mark
      }
    ) {
      affected_rows
    }
  }
`;

export const UpdateMark = gql`
  mutation updateMark($id: uuid!, $student_id: uuid, $mark: String) {
    update_marks_by_pk(
      pk_columns: { id: $id }
      _set: { student_id: $student_id, mark: $mark }
    ) {
      id
    }
  }
`;

export const DeleteMark = gql`
  mutation deleteMark($id: uuid!) {
    delete_marks_by_pk(id: $id) {
      id
    }
  }
`;
