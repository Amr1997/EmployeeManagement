import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, notification } from 'antd';
import { useFetchEmployeeByIdQuery, useUpdateEmployeeMutation } from '../features/employees/employeesApi';
import { useFetchDepartmentsQuery } from '../features/departments/departmentsApi';
import { useFetchCompaniesQuery } from '../features/companies/companiesApi';
import { useSelector } from 'react-redux';

const { Option } = Select;

const ViewEmployeePage = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { role, employeeId } = useSelector((state) => state.auth);
  const id = paramId || employeeId;
  const { data: employee, isLoading: employeeLoading } = useFetchEmployeeByIdQuery(id);
  const { data: departments, isLoading: departmentsLoading } = useFetchDepartmentsQuery();
  const { data: companies, isLoading: companiesLoading } = useFetchCompaniesQuery();

  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

  useEffect(() => {
    if (!employee && !employeeLoading) {
      notification.error({
        message: 'Error',
        description: 'Employee not found.',
      });
    }

    // Navigate to profile if role is Employee and editing someone else's data
    if (role === 'Employee' && paramId && paramId !== employeeId) {
      navigate(`/profile/${employeeId}`);
    }
  }, [employee, employeeLoading, role, paramId, employeeId, navigate]);

  if (employeeLoading || departmentsLoading || companiesLoading) {
    return <p>Loading...</p>;
  }

  const onFinish = async (values) => {
    const updatedEmployeeData = {
      ...values,
      user: {
        username: values.username,
        email: values.email,
        role: values.role,
      },
    };

    try {
      await updateEmployee({ id, ...updatedEmployeeData }).unwrap();
      notification.success({
        message: 'Success',
        description: 'Employee updated successfully!',
      });
      navigate('/employees');
    } catch (error) {
      console.log(error.data);
      notification.error({
        message: 'Error',
        description: error?.data?.department[0] || 'Failed to update the employee.',
      });
    }
  };
  console.log('employee:', employee);
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <h1>Edit Employee</h1>
      <Form
        layout="vertical"
        initialValues={{
          ...employee,
          role: employee?.user?.role, // Set initial value for role from employee.user.role
          company: employee?.company, // Include company and department as they are numeric IDs
          department: employee?.department,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the employee name' }]}
        >
          <Input placeholder="Enter employee name" disabled={role === 'Employee'} />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter the email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Enter email" disabled={role === 'Employee'} />
        </Form.Item>

        <Form.Item
          label="Mobile"
          name="mobile"
          rules={[{ required: true, message: 'Please enter the mobile number' }]}
        >
          <Input placeholder="Enter mobile number" disabled={role === 'Employee'} />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter the address' }]}
        >
          <Input placeholder="Enter address" disabled={role === 'Employee'} />
        </Form.Item>

        <Form.Item
          label="Designation"
          name="designation"
          rules={[{ required: true, message: 'Please enter the designation' }]}
        >
          <Input placeholder="Enter designation" disabled={role === 'Employee'} />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please enter a username' }]}
        >
          <Input placeholder="Enter username" disabled={role === 'Employee'} />
        </Form.Item>

        {/* Company Field */}
        <Form.Item
          label="Company"
          name="company"
          rules={[{ required: true, message: 'Please select a company' }]}
        >
          <Select
            placeholder="Select a company"
            disabled={role === 'Employee'}
            optionFilterProp="children"
          >
            {companies?.map((company) => (
              <Option key={company.id} value={company.id}>
                {company.name}
              </Option>
            ))}
          </Select>
        </Form.Item>


        {/* Department Field */}
        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: 'Please select a department' }]}
        >
          <Select
            placeholder="Select a department"
            disabled={role === 'Employee'}
            optionFilterProp="children"
          >
            {departments?.map((dept) => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Form.Item>


        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Select placeholder="Select status" disabled={role === 'Employee'}>
            <Option value="Application Received">Application Received</Option>
            <Option value="Interview Scheduled">Interview Scheduled</Option>
            <Option value="Hired">Hired</Option>
            <Option value="Not Accepted">Not Accepted</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select role" disabled={role === 'Employee'}>
            <Option value="Admin">Admin</Option>
            <Option value="Manager">Manager</Option>
            <Option value="Employee">Employee</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isUpdating} disabled={role === 'Employee'}>
            Update Employee
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ViewEmployeePage;
