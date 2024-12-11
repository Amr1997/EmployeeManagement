import React from 'react';
import { Table, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useFetchCompaniesQuery, useDeleteCompanyMutation } from '../features/companies/companiesApi';

const ListCompaniesPage = () => {
  const { data: companies, isLoading } = useFetchCompaniesQuery();
  const [deleteCompany] = useDeleteCompanyMutation();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      await deleteCompany(id).unwrap();
    } catch (error) {
      console.error('Failed to delete company:', error);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Departments', dataIndex: 'department_count', key: 'department_count' },
    { title: 'Employees', dataIndex: 'employee_count', key: 'employee_count' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/companies/${record.id}`)}>View</Button>
          <Button type="link" onClick={() => navigate(`/companies/${record.id}`)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Companies</h1>
      <Button type="primary" onClick={() => navigate('/companies/new')}>Add Company</Button>
      <Table
        dataSource={companies || []}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default ListCompaniesPage;
