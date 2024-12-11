import React from 'react';
import { useFetchDashboardAnalyticsQuery } from '../features/dashboard/dashboardApi';

const Dashboard = () => {
  const { data, isLoading, error } = useFetchDashboardAnalyticsQuery();

  if (isLoading) {
    return <p>Loading analytics...</p>;
  }

  if (error) {
    return <p>Error fetching analytics</p>;
  }

  return (
    <div>
      <h1>Dashboard Analytics</h1>
      <div>
        <p><strong>Total Companies:</strong> {data.total_companies}</p>
        <p><strong>Total Departments:</strong> {data.total_departments}</p>
        <p><strong>Total Employees:</strong> {data.total_employees}</p>
      </div>
      <h2>Employee Status Breakdown</h2>
      <ul>
        {data.employee_status_breakdown.map((status) => (
          <li key={status.status}>
            {status.status}: {status.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
