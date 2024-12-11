import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import ListCompaniesPage from './pages/ListCompaniesPage';
import ViewCompanyPage from './pages/ViewCompanyPage';
import CreateCompanyPage from './pages/CreateCompanyPage';
import ListDepartmentsPage from './pages/ListDepartmentsPage';
import ViewDepartmentPage from './pages/ViewDepartmentPage';
import CreateDepartmentPage from './pages/CreateDepartmentPage';
import ListEmployeesPage from './pages/ListEmployeesPage';
import ViewEmployeePage from './pages/ViewEmployeePage';
import CreateEmployeePage from './pages/CreateEmployeePage';

const App = () => {
  const { accessToken, role, employeeId } = useSelector((state) => state.auth); // Include role and employeeId

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        {accessToken ? (
          <Route element={<AppLayout />}>
            {/* Admin or Manager Routes */}
            {role === 'Admin' || role === 'Manager' ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/companies" element={<ListCompaniesPage />} />
                <Route path="/companies/:id" element={<ViewCompanyPage />} />
                <Route path="/companies/new" element={<CreateCompanyPage />} />
                <Route path="/departments" element={<ListDepartmentsPage />} />
                <Route path="/departments/:id" element={<ViewDepartmentPage />} />
                <Route path="/departments/new" element={<CreateDepartmentPage />} />
                <Route path="/employees" element={<ListEmployeesPage />} />
                <Route path="/employees/new" element={<CreateEmployeePage />} />
                <Route path="/employees/:id" element={<ViewEmployeePage />} />
                <Route path={`/profile`} element={<ViewEmployeePage />} />
              </>
            ) : null}

            {/* Employee Route */}
            {role === 'Employee' && (
              <Route path={`/profile`} element={<ViewEmployeePage />} />
            )}
          </Route>
        ) : (
          // Redirect to login if not authenticated
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
