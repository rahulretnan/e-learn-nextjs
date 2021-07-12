import { gql } from 'urql/core';

export const GetTeacher = gql`
  query getTeacher($user_id: uuid) {
    teachers(where: { user_id: { _eq: $user_id } }) {
      id
    }
  }
`;

export const GetAssignments = gql`
  query getAssignments($teacher_id: uuid!) {
    assignments(where: { teacher_id: { _eq: $teacher_id } }) {
      id
      assignment
      created_at
      last_date
      subject {
        id
        subject
      }
    }
  }
`;

export const GetStudentsAssignments = gql`
  query getStudentAssignment($assignment_id: uuid!) {
    student_assignments(
      where: { assignment: { id: { _eq: $assignment_id } } }
    ) {
      student {
        user {
          name
        }
        semester {
          semester
        }
      }
      created_at
      file
    }
  }
`;

export const GetAssignmentFormDetails = gql`
  query getAssignmentFormDetails {
    semesters {
      id
      semester
    }
    subjects {
      id
      subject
    }
  }
`;
