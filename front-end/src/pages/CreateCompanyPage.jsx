import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import { useAddCompanyMutation } from '../features/companies/companiesApi';

const CreateCompanyPage = () => {
  const [addCompany, { isLoading }] = useAddCompanyMutation();

  // Handles form submission
  const onFinish = async (values) => {
    try {
      await addCompany(values).unwrap();
      notification.success({
        message: 'Success',
        description: 'Company created successfully!',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error?.data?.message || 'Failed to create the company.',
      });
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <h1>Create a New Company</h1>
      <Form
        name="createCompany"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Company Name"
          name="name"
          rules={[{ required: true, message: 'Please input the company name!' }]}
        >
          <Input placeholder="Enter company name" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create Company
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCompanyPage;
