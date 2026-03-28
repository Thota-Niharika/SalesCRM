import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AppLayout from './components/layout/AppLayout';
// Using lazy loading for future scalability, or just importing directly for now.
// For now, these are placeholders that we'll implement step-by-step.
import LeadList from './pages/Leads/LeadList';
import LeadDetail from './pages/Leads/LeadDetail';
import PaymentPanel from './pages/Payments/PaymentPanel';
import StudentPanel from './pages/Students/StudentPanel';
import StudentProfile from './pages/Students/StudentProfile';
import TaskList from './pages/Tasks/TaskList';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<LeadList />} />
        <Route path="/leads/:id" element={<LeadDetail />} />
        <Route path="/payments" element={<PaymentPanel />} />
        <Route path="/students" element={<StudentPanel />} />
        <Route path="/students/:id" element={<StudentProfile />} />
        <Route path="/tasks" element={<TaskList />} />
      </Route>
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
