import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import PropTypes from 'prop-types';

// Clear all authentication data immediately when the file loads
(() => {
  const keysToRemove = [
    'user',
    'users',
    ...Object.keys(localStorage).filter(key => 
      key.startsWith('enrollment_') || 
      key.startsWith('batch_') || 
      key.startsWith('attendance_')
    )
  ];
  keysToRemove.forEach(key => localStorage.removeItem(key));
})();

function PrivateRoute({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  React.useEffect(() => {
    if (!user.id || !user.role) {
      navigate('/login', { replace: true });
    }
  }, [user.id, user.role, navigate]);

  return user.id && user.role ? children : null;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <TeacherDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <PrivateRoute>
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            {/* Catch-all route - redirects both "/" and any unknown paths to "/login" */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

