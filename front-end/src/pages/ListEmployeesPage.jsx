import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Popconfirm } from 'antd';
import { useFetchEmployeesQuery, useDeleteEmployeeMutation } from '../features/employees/employeesApi';

const ListEmployeesPage = () => {
  const { data: employees, isLoading } = useFetchEmployeesQuery();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
    }
  };

  // Define columns for the Ant Design table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Link to={`/employees/${record.id}`}>View</Link>
          <span style={{ margin: '0 8px' }}>|</span>
          <Link to={`/employees/${record.id}`}>Edit</Link>
          <span style={{ margin: '0 8px' }}>|</span>
          <Popconfirm
            title="Are you sure you want to delete this employee?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1>Employees</h1>
      <Link to="/employees/new">
        <Button type="primary" style={{ marginBottom: '16px' }}>
          Create Employee
        </Button>
      </Link>
      <Table
        dataSource={employees}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ListEmployeesPage;
