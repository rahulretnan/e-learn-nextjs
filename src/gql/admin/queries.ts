import { gql } from 'urql/core';

export const AdminDashboardDetails = gql`
  query adminDashboard {
    students: students_aggregate {
      aggregate {
        count
      }
    }
    teachers: teachers_aggregate {
      aggregate {
        count
      }
    }
    parents: parents_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const GetTeachers = gql`
  query getTeachers {
    teachers {
      id
      user {
        name
        email
        user_details {
          phone
        }
      }
    }
  }
`;

export const GetStudents = gql`
  query getStudents {
    students {
      id
      user {
        name
        email
        user_details {
          phone
        }
      }
    }
  }
`;

export const GetDepartments = gql`
  query getDepartments {
    departments {
      id
      department
    }
  }
`;
export const GetDepartmentsByTeacher = gql`
  query getDepartmentsByTeacher($teacher_id: uuid!) {
    departments(where: { teachers: { id: { _eq: $teacher_id } } }) {
      id
      department
    }
  }
`;

export const GetCourses = gql`
  query getCourses {
    courses {
      id
      course
      department {
        id
        department
      }
    }
    departments {
      id
      department
    }
  }
`;

export const GetCoursesByDepartment = gql`
  query getCoursesByDepartment($department_id: uuid!) {
    courses(where: { department_id: { _eq: $department_id } }) {
      id
      course
      department {
        id
        department
      }
    }
    departments {
      id
      department
    }
  }
`;

export const GetSemesters = gql`
  query getSemesters {
    semesters {
      id
      semester
      course {
        id
        course
      }
    }
    courses {
      id
      course
    }
  }
`;
export const GetSemestersByCourse = gql`
  query getSemestersByCourse($course_id: uuid!) {
    semesters(where: { course_id: { _eq: $course_id } }) {
      id
      semester
      course {
        id
        course
      }
    }
    courses {
      id
      course
    }
  }
`;

export const GetDepartmentsGetCoursesGetSemesters = gql`
  query getDepartments {
    departments {
      id
      department
    }
    courses {
      id
      course
      department {
        id
        department
      }
    }
    semesters {
      id
      semester
      course {
        id
        course
      }
    }
  }
`;

export const GetSubjects = gql`
  query getSubjects {
    subjects {
      id
      subject
      semester {
        id
        semester
      }
    }
    semesters {
      id
      semester
    }
  }
`;
export const GetSubjectsBySemester = gql`
  query getSubjects($semester_id: uuid!) {
    subjects(where: { semester_id: { _eq: $semester_id } }) {
      id
      subject
      semester {
        id
        semester
      }
    }
    semesters {
      id
      semester
    }
  }
`;

export const GetParents = gql`
  query getParents {
    parents {
      id
      user {
        name
        email
        user_details {
          phone
        }
      }
    }
  }
`;

export const GetAssignedTeachers = gql`
  query getAssignedTeachers {
    teachers {
      id
      user {
        name
      }
      department {
        id
        department
      }
      teacher_courses {
        course {
          id
          course
        }
      }
      teacher_semesters {
        semester {
          id
          semester
        }
      }
      teacher_subjects {
        subject {
          id
          subject
        }
      }
    }
  }
`;
