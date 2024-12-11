import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Space } from 'antd';
import { useFetchDepartmentsQuery, useDeleteDepartmentMutation } from '../features/departments/departmentsApi';

const ListDepartmentsPage = () => {
  const { data: departments, isLoading } = useFetchDepartmentsQuery();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      deleteDepartment(id);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Number of Employees',
      dataIndex: 'num_employees',
      key: 'num_employees',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/departments/${record.id}`}>View</Link>
          <Link to={`/departments/${record.id}`}>Edit</Link>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Departments</h1>
      <Link to="/departments/new">
        <Button type="primary" style={{ marginBottom: '20px' }}>
          Create Department
        </Button>
      </Link>
      <Table dataSource={departments} columns={columns} rowKey="id" />
    </div>
  );
};

export default ListDepartmentsPage;