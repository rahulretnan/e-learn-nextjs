import { gql } from 'urql/core';

export const StudentDashboard = gql`
  query studentDashboard($semester_id: uuid, $student_id: uuid) {
    total_assignment: assignments_aggregate(
      where: { semester_id: { _eq: $semester_id } }
    ) {
      aggregate {
        count
      }
    }
    submitted_assignment: student_assignments_aggregate(
      where: { student_id: { _eq: $student_id } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GetAssignments = gql`
  query getAssignments($semester_id: uuid!) {
    assignments(where: { semester_id: { _eq: $semester_id } }) {
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

export const GetStudentDetails = gql`
  query getStudentDetails($student_id: uuid!) {
    students(where: { id: { _eq: $student_id } }) {
      course_id
      semester_id
      department_id
    }
  }
`;

export const GetAssignmentById = gql`
  query getAssignments($id: uuid!) {
    assignments_by_pk(id: $id) {
      id
      assignment
      created_at
      last_date
    }
  }
`;

export const GetAttendance = gql`
  query getSubjectBySemester($semester_id: uuid!, $student_id: uuid!) {
    subjects(where: { semester_id: { _eq: $semester_id } }) {
      id
      subject
      attendances(where: { student_id: { _eq: $student_id } }) {
        attendance
      }
    }
  }
`;
export const GetMarks = gql`
  query getSubjectBySemester($semester_id: uuid!, $student_id: uuid!) {
    subjects(where: { semester_id: { _eq: $semester_id } }) {
      id
      subject
      marks(where: { student_id: { _eq: $student_id } }) {
        mark
      }
    }
  }
`;
