import React from 'react';
import { Form, Input, Button, Select, notification } from 'antd';
import { useCreateEmployeeMutation } from '../features/employees/employeesApi';
import { useFetchDepartmentsQuery } from '../features/departments/departmentsApi';
import { useFetchCompaniesQuery } from '../features/companies/companiesApi';

const { Option } = Select;

const CreateEmployeePage = () => {
  const [form] = Form.useForm();
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const { data: departments, isLoading: departmentsLoading } = useFetchDepartmentsQuery();
  const { data: companies, isLoading: companiesLoading } = useFetchCompaniesQuery();

  const onFinish = async (values) => {
    const employeeData = {
      name: values.name,
      email: values.email,
      mobile: values.mobile,
      address: values.address,
      designation: values.designation,
      department: values.department,
      company: values.company,
      status: values.status,
      user: {
        username: values.username,
        email: values.email,
        password: values.password,
      },
    };

    try {
      await createEmployee(employeeData).unwrap();
      notification.success({
        message: 'Success',
        description: 'Employee created successfully!',
      });
      form.resetFields();
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to create employee. Please try again.',
      });
    }
  };

  if (departmentsLoading || companiesLoading) {
    return <p>Loading data...</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <h1>Create Employee</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the employee name' }]}
        >
          <Input placeholder="Enter employee name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter the email' }, { type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          label="Mobile"
          name="mobile"
          rules={[{ required: true, message: 'Please enter the mobile number' }]}
        >
          <Input placeholder="Enter mobile number" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter the address' }]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>

        <Form.Item
          label="Designation"
          name="designation"
          rules={[{ required: true, message: 'Please enter the designation' }]}
        >
          <Input placeholder="Enter designation" />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please enter a username' }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter a password' }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: 'Please select a department' }]}
        >
          <Select placeholder="Select a department">
            {departments?.map((dept) => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Company"
          name="company"
          rules={[{ required: true, message: 'Please select a company' }]}
        >
          <Select placeholder="Select a company">
            {companies?.map((company) => (
              <Option key={company.id} value={company.id}>
                {company.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select a status' }]}>
          <Select placeholder="Select status">
            <Option value="Application Received">Application Received</Option>
            <Option value="Interview Scheduled">Interview Scheduled</Option>
            <Option value="Hired">Hired</Option>
            <Option value="Not Accepted">Not Accepted</Option>
          </Select>
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create Employee
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateEmployeePage;
