import React from 'react';
import { Form, Input, Button, notification, List, Card } from 'antd';
import { Navigate, useParams } from 'react-router-dom';
import { useFetchCompanyByIdQuery, useUpdateCompanyMutation } from '../features/companies/companiesApi';

const ViewCompanyPage = () => {
  const { id } = useParams();
  const { data: company, isLoading } = useFetchCompanyByIdQuery(id);
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

  const onFinish = async (values) => {
    try {
      await updateCompany({ id, ...values }).unwrap();
      notification.success({
        message: 'Success',
        description: 'Company updated successfully!',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error?.data?.message || 'Failed to update the company.',
      });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!company) {
    return <p>Company not found.</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <h1>Edit Company</h1>
      <Form
        name="editCompany"
        layout="vertical"
        initialValues={{
          name: company.name,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Company Name"
          name="name"
          rules={[{ required: true, message: 'Please input the company name!' }]}>
          <Input placeholder="Enter company name" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isUpdating}>
            Update Company
          </Button>
        </Form.Item>
      </Form>

      <h2>Departments</h2>
      <List
        dataSource={company.departments}
        renderItem={(department) => (
          <List.Item>
            <Card title={department.name}>
              <p><strong>ID:</strong> {department.id}</p>
              <p><strong>Number of Employees:</strong> {department.num_employees}</p>
            </Card>
          </List.Item>
        )}
      />

      <h2>Employees</h2>
      <List
        dataSource={company.employees}
        renderItem={(employee) => (
          <List.Item>
            <Card title={employee.name}>
              <p><strong>Email:</strong> {employee.email}</p>
              <p><strong>Mobile:</strong> {employee.mobile}</p>
              <p><strong>Address:</strong> {employee.address}</p>
              <p><strong>Designation:</strong> {employee.designation}</p>
              <p><strong>Department:</strong> {employee.department}</p>
              <p><strong>Status:</strong> {employee.status}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ViewCompanyPage;
