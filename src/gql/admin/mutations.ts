import { gql } from 'urql/core';

export const AddDepartment = gql`
  mutation addDepartment($department: String) {
    insert_departments(
      objects: { department: $department }
      on_conflict: { constraint: departments_pkey, update_columns: department }
    ) {
      affected_rows
    }
  }
`;
export const UpdateDepartment = gql`
  mutation updateDepartment($id: uuid!, $department: String) {
    update_departments_by_pk(
      pk_columns: { id: $id }
      _set: { department: $department }
    ) {
      id
    }
  }
`;
export const DeleteDepartment = gql`
  mutation deleteDepartment($id: uuid!) {
    delete_departments_by_pk(id: $id) {
      id
    }
  }
`;

export const AddCourse = gql`
  mutation addCourse($course: String, $department_id: uuid) {
    insert_courses(
      objects: { course: $course, department_id: $department_id }
    ) {
      affected_rows
    }
  }
`;

export const UpdateCourse = gql`
  mutation updateCourse($id: uuid!, $course: String, $department_id: uuid) {
    update_courses_by_pk(
      pk_columns: { id: $id }
      _set: { course: $course, department_id: $department_id }
    ) {
      id
    }
  }
`;

export const DeleteCourse = gql`
  mutation deleteCourse($id: uuid!) {
    delete_courses_by_pk(id: $id) {
      id
    }
  }
`;

export const AddSemester = gql`
  mutation addSemester($course_id: uuid, $semester: String) {
    insert_semesters(objects: { course_id: $course_id, semester: $semester }) {
      affected_rows
    }
  }
`;

export const UpdateSemester = gql`
  mutation updateSemester($id: uuid!, $course_id: uuid, $semester: String) {
    update_semesters_by_pk(
      pk_columns: { id: $id }
      _set: { course_id: $course_id, semester: $semester }
    ) {
      id
    }
  }
`;

export const DeleteSemester = gql`
  mutation deleteSemester($id: uuid!) {
    delete_semesters_by_pk(id: $id) {
      id
    }
  }
`;

export const AddSubject = gql`
  mutation addSubject($semester_id: uuid, $subject: String) {
    insert_subjects(objects: { semester_id: $semester_id, subject: $subject }) {
      affected_rows
    }
  }
`;

export const UpdateSubject = gql`
  mutation updateSubject($id: uuid!, $semester_id: uuid, $subject: String) {
    update_subjects_by_pk(
      pk_columns: { id: $id }
      _set: { semester_id: $semester_id, subject: $subject }
    ) {
      id
    }
  }
`;

export const DeleteSubject = gql`
  mutation deleteSubject($id: uuid!) {
    delete_subjects_by_pk(id: $id) {
      id
    }
  }
`;

export const UpdateTeacherDepartment = gql`
  mutation updateTeacherDepartment($user_id: uuid!, $department_id: uuid) {
    insert_teachers(
      objects: { user_id: $user_id, department_id: $department_id }
    ) {
      affected_rows
    }
  }
`;

export const UpdateStudentDepartment = gql`
  mutation updateStudentDepartment($user_id: uuid!, $department_id: uuid) {
    insert_students(
      objects: { user_id: $user_id, department_id: $department_id }
    ) {
      affected_rows
    }
  }
`;

export const UpdateParentStudent = gql`
  mutation updateParentStudent($user_id: uuid!, $student_id: uuid) {
    insert_parents(objects: { user_id: $user_id, student_id: $student_id }) {
      affected_rows
    }
  }
`;
