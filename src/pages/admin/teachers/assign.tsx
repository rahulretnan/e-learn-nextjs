import { Button, Form, Modal, Select, Table } from 'antd';
import { get } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import { AssignTeacherSubject } from '~/gql/admin/mutations';
import {
  GetAssignedTeachers,
  GetCoursesByDepartment,
  GetDepartmentsByTeacher,
  GetSemestersByCourse,
  GetSubjectsBySemester,
  GetTeachers,
} from '~/gql/admin/queries';

const AssignTeacher = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { Option } = Select;
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<string>('Add');
  const [initialValues, setInitialValues] = useState<{
    teacher_id: string;
    department_id: string;
    course_id: string;
    semester_id: string;
    subject_id: string;
  }>();

  const [assignedTeachers, setAssignedTeachers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [teacherId, setTeacherId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const [{ data: assignedTeacher }, reftechAssignedTeachers] = useQuery({
    query: GetAssignedTeachers,
    requestPolicy: 'network-only',
  });
  const [{ data: teacher }, fetchTeacher] = useQuery({
    query: GetTeachers,
    requestPolicy: 'network-only',
  });
  const [{ data: department }, fetchDepartment] = useQuery({
    query: GetDepartmentsByTeacher,
    requestPolicy: 'network-only',
    variables: { teacher_id: teacherId },
    pause: !teacherId,
  });
  const [{ data: course }, fetchCourse] = useQuery({
    query: GetCoursesByDepartment,
    requestPolicy: 'network-only',
    variables: { department_id: departmentId },
    pause: !departmentId,
  });
  const [{ data: semester }, fetchSemester] = useQuery({
    query: GetSemestersByCourse,
    requestPolicy: 'network-only',
    variables: { course_id: courseId },
    pause: !courseId,
  });
  const [{ data: subject }, fetchSubject] = useQuery({
    query: GetSubjectsBySemester,
    requestPolicy: 'network-only',
    variables: { semester_id: semesterId },
    pause: !semesterId,
  });

  useEffect(() => {
    if (assignedTeacher) {
      setAssignedTeachers(get(assignedTeacher, 'teachers'));
    }
  }, [assignedTeacher]);

  useEffect(() => {
    if (teacher) {
      setTeachers(get(teacher, 'teachers'));
    }
  }, [teacher]);

  useEffect(() => {
    if (department) {
      setDepartments(get(department, 'departments'));
    }
  }, [department]);

  useEffect(() => {
    if (course) {
      setCourses(get(course, 'courses'));
    }
  }, [course]);

  useEffect(() => {
    if (semester) {
      setSemesters(get(semester, 'semesters'));
    }
  }, [semester]);

  useEffect(() => {
    if (subject) {
      setSubjects(get(subject, 'subjects'));
    }
  }, [subject]);

  const [, assignTeacherSubject] = useMutation(AssignTeacherSubject);
  //   const [, updateDepartment] = useMutation(UpdateDepartment);
  //   const [, deleteDepartment] = useMutation(DeleteDepartment);

  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  const showAddModal = () => {
    fetchTeacher();
    setAction('Add');
    setIsModalVisible(true);
    setInitialValues({
      teacher_id: '',
      department_id: '',
      course_id: '',
      semester_id: '',
      subject_id: '',
    });
  };

  const showEditModal = useCallback(
    async (data) => {
      setAction('Edit');
      setIsModalVisible(true);
      setInitialValues({
        teacher_id: data.id,
        department_id: get(data, 'department.id'),
        course_id: get(data, '0.course.id'),
        semester_id: get(data, '0.semester.id'),
        subject_id: get(data, '0.subject.id'),
      });
      setTeacherId(data.id);
      setDepartmentId(get(data, 'department.id'));
      setCourseId(get(data, '0.course.id'));
      setSemesterId(get(data, '0.semester.id'));
      setSubjectId(get(data, '0.subject.id'));
      fetchTeacher();
      fetchDepartment();
      fetchCourse();
      fetchSemester();
      fetchSubject();
      form.setFieldsValue({
        teacher_id: data.id,
        department_id: get(data, 'department.id'),
        course_id: get(data, '0.course.course'),
        semester_id: get(data, '0.semester.semester'),
        subject_id: get(data, '0.subject.subject'),
      });
    },
    [initialValues, action, assignedTeachers]
  );

  const reset = () => {
    setTeacherId('');
    setTeachers([]);
    setDepartmentId('');
    setDepartments([]);
    setCourseId('');
    setCourses([]);
    setSemesters([]);
    setSemesterId('');
    setSubjects([]);
    setSubjectId('');
    form.resetFields();
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    if (action === 'Add') {
      await assignTeacherSubject({
        teacher_id: values.teacher_id,
        course_id: values.course_id,
        semester_id: values.semester_id,
        subject_id: values.subject_id,
      });
    } else {
      //   await updateDepartment({
      //     id: initialValues?.id,
      //     department: values?.department,
      //   });
    }
    await reset();
    reftechAssignedTeachers();
  };
  const columns = [
    {
      title: 'Sl No.',
      key: 'index',
      render: (value, item, index) => (page - 1) * 10 + index + 1,
      width: 50,
    },
    {
      title: 'Teacher',
      dataIndex: 'user',
      render: (record) => get(record, 'name'),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      render: (record) => get(record, 'department'),
    },
    {
      title: 'Course',
      dataIndex: 'teacher_courses',
      render: (record) => get(record, '0.course.course'),
    },
    {
      title: 'Semester',
      dataIndex: 'teacher_semesters',
      render: (record) => get(record, '0.semester.semester'),
    },
    {
      title: 'Subject',
      dataIndex: 'teacher_subjects',
      render: (record) => get(record, '0.subject.subject'),
    },
  ];

  return (
    <>
      <Button
        htmlType="button"
        className="float-right"
        type="primary"
        onClick={showAddModal}
      >
        Add
      </Button>
      <Table
        bordered
        dataSource={assignedTeachers}
        columns={columns}
        rowKey={(record) => record?.id}
        pagination={{
          onChange(current) {
            setPage(current);
          },
        }}
        // onRow={(record) => {
        //   return {
        //     onClick: () => showEditModal(record),
        //   };
        // }}
      />
      <Modal
        title={`${action} Teacher subject`}
        visible={isModalVisible}
        footer={null}
        onCancel={reset}
      >
        <Form
          className="text-left"
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
          initialValues={initialValues}
        >
          <Form.Item
            name="teacher_id"
            label="Teacher"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              defaultValue=""
              onChange={(value) => {
                setDepartmentId('');
                setDepartments([]);
                setCourseId('');
                setCourses([]);
                setSemesters([]);
                setSemesterId('');
                setSubjects([]);
                setSubjectId('');
                form.setFieldsValue({
                  department_id: '',
                  course_id: '',
                  semester_id: '',
                  subject_id: '',
                });
                setTeacherId(value);
              }}
              style={{ width: 120 }}
            >
              <Option disabled value="">
                Select
              </Option>
              {teachers.map(({ user, id }) => (
                <Option key={`dep${id}`} value={id}>
                  {get(user, 'name')}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="department_id"
            label="Department"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              defaultValue=""
              disabled={departments.length === 0 && action !== 'Edit'}
              onChange={(value) => {
                setCourseId('');
                setCourses([]);
                setSemesters([]);
                setSemesterId('');
                setSubjects([]);
                setSubjectId('');
                form.setFieldsValue({
                  course_id: '',
                  semester_id: '',
                  subject_id: '',
                });
                setDepartmentId(value);
              }}
              style={{ width: 120 }}
            >
              <Option disabled value="">
                Select
              </Option>
              {departments.map(({ department, id }) => (
                <Option key={`dep${id}`} value={id}>
                  {department}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="course_id"
            label="Course"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              defaultValue=""
              disabled={courses.length === 0 && action !== 'Edit'}
              value={courseId}
              onChange={(value) => {
                setSemesters([]);
                setSemesterId('');
                setSubjects([]);
                setSubjectId('');
                form.setFieldsValue({ semester_id: '', subject_id: '' });
                setCourseId(value);
              }}
              style={{ width: 120 }}
            >
              <Option disabled value="">
                Select
              </Option>
              {courses.map(({ course, id }) => (
                <Option key={`dep${id}`} value={id}>
                  {course}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="semester_id"
            label="Semester"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              disabled={semesters.length === 0 && action !== 'Edit'}
              defaultValue=""
              value={semesterId}
              style={{ width: 120 }}
              onChange={(value) => {
                setSubjects([]);
                setSubjectId('');
                form.setFieldsValue({ subject_id: '' });
                setSemesterId(value);
              }}
            >
              <Option disabled value="">
                Select
              </Option>
              {semesters.map(({ semester, id }) => (
                <Option key={`dep${id}`} value={id}>
                  {semester}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="subject_id"
            label="Subject"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              disabled={subjects.length === 0 && action !== 'Edit'}
              defaultValue=""
              value={subjectId}
              style={{ width: 120 }}
              onChange={(value) => {
                setSubjectId(value);
              }}
            >
              <Option disabled value="">
                Select
              </Option>
              {subjects.map(({ subject, id }) => (
                <Option key={`dep${id}`} value={id}>
                  {subject}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {`${action === 'Add' ? 'Save' : 'Update'}`}
            </Button>
            {action !== 'Add' ? (
              <Button
                htmlType="button"
                className="float-right"
                danger
                // onClick={async () => {
                //   await deleteDepartment({ id: initialValues?.id });
                //   refetch();
                //   reset();
                // }}
              >
                Delete
              </Button>
            ) : (
              ''
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AssignTeacher;
