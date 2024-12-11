import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Select, notification } from 'antd';
import { useFetchDepartmentByIdQuery, useUpdateDepartmentMutation } from '../features/departments/departmentsApi';
import { useFetchCompaniesQuery } from '../features/companies/companiesApi';

const { Option } = Select;

const ViewDepartmentPage = () => {
  const { id } = useParams();
  const { data: department, isLoading: departmentLoading } = useFetchDepartmentByIdQuery(id);
  const { data: companies, isLoading: companiesLoading } = useFetchCompaniesQuery();
  const [updateDepartment, { isLoading: updateLoading }] = useUpdateDepartmentMutation();
  const [form] = Form.useForm();

  if (departmentLoading || companiesLoading) {
    return <p>Loading...</p>;
  }

  if (!department) {
    return <p>Department not found.</p>;
  }

  const onFinish = async (values) => {
    try {
      await updateDepartment({ id, ...values }).unwrap();
      notification.success({
        message: 'Success',
        description: 'Department updated successfully!',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update department. Please try again.',
      });
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <h1>Edit Department</h1>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: department.name,
          company: department.company,
        }}
        onFinish={onFinish}
      >
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
          <Select placeholder="Select a company">
            {companies?.map((company) => (
              <Option key={company.id} value={company.id}>
                {company.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Number of Employees">
          <Input value={department.num_employees} disabled />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={updateLoading}>
            Update Department
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ViewDepartmentPage;
