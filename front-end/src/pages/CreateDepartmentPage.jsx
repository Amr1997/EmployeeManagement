import React from 'react';
import { Form, Input, Button, Select, notification } from 'antd';
import { useFetchCompaniesQuery } from '../features/companies/companiesApi';
import { useCreateDepartmentMutation } from '../features/departments/departmentsApi';

const { Option } = Select;

const CreateDepartmentPage = () => {
  const { data: companies, isLoading: companiesLoading, isError: companiesError } = useFetchCompaniesQuery();
  const [createDepartment, { isLoading: createLoading }] = useCreateDepartmentMutation();

  const onFinish = async (values) => {
    try {
      await createDepartment(values).unwrap();
      notification.success({
        message: 'Success',
        description: 'Department created successfully!',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to create department. Please try again.',
      });
    }
  };

  if (companiesError) {
    return <p>Error loading companies. Please refresh the page.</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <h1>Create Department</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Department Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the department name' }]}
        >
          <Input placeholder="Enter department name" />
        </Form.Item>

        <Form.Item
          label="Company"
          name="company"
          rules={[{ required: true, message: 'Please select a company' }]}
        >
          <Select placeholder="Select a company" loading={companiesLoading}>
            {companies?.map((company) => (
              <Option key={company.id} value={company.id}>
                {company.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={createLoading}>
            Create Department
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateDepartmentPage;
