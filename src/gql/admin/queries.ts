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
