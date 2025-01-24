import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AttendanceTracker from '../components/AttendanceTracker';
import { PageTransition } from '../components/PageTransition';
import { LoginForm } from '../components/LoginForm';
import { NavigationButtons } from '../components/NavigationButtons';

function Login() {
  const navigate = useNavigate();
  const [showAttendanceTracker, setShowAttendanceTracker] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);

      if (!user) {
        setError('Invalid credentials');
        return;
      }

      if (user.role !== formData.role) {
        setError(`This email is registered as a ${user.role}. Please select the correct role.`);
        return;
      }

      localStorage.setItem('user', JSON.stringify(user));
      navigate(user.role === 'teacher' ? '/dashboard' : '/student-dashboard');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
          <NavigationButtons 
            showAttendanceTracker={showAttendanceTracker}
            setShowAttendanceTracker={setShowAttendanceTracker}
          />

          {showAttendanceTracker ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AttendanceTracker />
            </motion.div>
          ) : (
            <LoginForm
              formData={formData}
              setFormData={setFormData}
              error={error}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default Login;