import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

function StudentDashboard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rollNumber: '',
    batch: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState({ 
    isEnrolled: false,
    batch: '',
    rollNumber: '',
    name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const savedEnrollment = localStorage.getItem(`enrollment_${user.id}`);
    if (savedEnrollment) {
      setEnrollmentStatus({ isEnrolled: true, ...JSON.parse(savedEnrollment) });
    }
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const rollNumberPattern = /^[A-Z]{2,4}\d{3}$/;
      if (!rollNumberPattern.test(formData.rollNumber)) {
        throw new Error('Invalid roll number format. Example: CSE001');
      }

      const existingEnrollment = localStorage.getItem(`enrollment_${user.id}`);
      if (existingEnrollment) {
        throw new Error('You are already enrolled in a batch');
      }

      const allEnrollments = Object.entries(localStorage)
        .filter(([key]) => key.startsWith('enrollment_'))
        .map(([, value]) => JSON.parse(value));

      const rollNumberExists = allEnrollments.some(
        enrollment => enrollment.rollNumber === formData.rollNumber
      );

      if (rollNumberExists) {
        throw new Error('This roll number is already registered');
      }

      const enrollmentData = {
        userId: user.id,
        rollNumber: formData.rollNumber,
        batch: formData.batch,
        name: formData.name,
        enrolledAt: new Date().toISOString()
      };

      localStorage.setItem(`enrollment_${user.id}`, JSON.stringify(enrollmentData));
      
      const batchKey = `batch_${formData.batch.replace(/\s+/g, '')}`;
      const batchEnrollments = JSON.parse(localStorage.getItem(batchKey) || '[]');
      batchEnrollments.push({
        id: user.id,
        rollNumber: formData.rollNumber,
        name: formData.name
      });
      localStorage.setItem(batchKey, JSON.stringify(batchEnrollments));

      setEnrollmentStatus({ isEnrolled: true, ...enrollmentData });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enrollment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (enrollmentStatus.isEnrolled) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {enrollmentStatus.name}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Roll Number</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {enrollmentStatus.rollNumber}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Batch</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {enrollmentStatus.batch}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Enrollment</h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter your full name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Roll Number
            </label>
            <input
              type="text"
              required
              placeholder="e.g., CSE001"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value.toUpperCase() })}
            />
            <p className="mt-1 text-sm text-gray-500">
              Format: Department code (2-4 letters) followed by 3 digits
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Batch
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
            >
              <option value="">Select your batch</option>
              <option value="CSE 2024">CSE 2024</option>
              <option value="ECE 2024">ECE 2024</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isSubmitting ? 'Enrolling...' : 'Enroll Now'}
          </button>
        </form>
      </div>
    </div>
  );
}

StudentDashboard.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      rollNumber: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string
    })
  )
};

export default StudentDashboard;