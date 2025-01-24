import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, AlertCircle, Users, ClipboardCheck } from 'lucide-react';
import AttendanceReport from '../components/AttendanceReport';
import PropTypes from 'prop-types';

function TeacherDashboard() {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [viewMode, setViewMode] = useState('attendance');
  const [batches, setBatches] = useState([
    { id: 'CSE2024', name: 'CSE 2024', students: [] },
    { id: 'ECE2024', name: 'ECE 2024', students: [] }
  ]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const loadBatchData = () => {
      const updatedBatches = batches.map(batch => {
        const batchKey = `batch_${batch.name.replace(/\s+/g, '')}`;
        const enrolledStudents = JSON.parse(localStorage.getItem(batchKey) || '[]');
        return {
          ...batch,
          students: enrolledStudents
        };
      });
      setBatches(updatedBatches);
    };

    loadBatchData();
  }, []);

  const handleAttendanceChange = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSubmit = () => {
    if (!selectedBatch) return;
    
    const currentDate = new Date().toISOString().split('T')[0];
    const attendanceKey = `attendance_${selectedBatch}_${currentDate}`;
    localStorage.setItem(attendanceKey, JSON.stringify(attendance));
    setAttendanceSubmitted(true);
    setShowReport(true);
  };

  const selectedBatchData = batches.find(batch => batch.id === selectedBatch);

  const renderStudentList = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">View Students by Batch</h3>
            <p className="mt-1 text-sm text-gray-500">Select a batch to view enrolled students</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batches.map(batch => (
              <div
                key={batch.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedBatch(batch.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{batch.name}</h4>
                    <p className="text-sm text-gray-500">
                      {batch.students.length} Students Enrolled
                    </p>
                  </div>
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedBatch && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedBatchData?.name} - Student List
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Total Students: {selectedBatchData?.students.length}
                </p>
              </div>
              <button
                onClick={() => setSelectedBatch('')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to Batches
              </button>
            </div>

            {selectedBatchData?.students.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Students Enrolled</h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are no students enrolled in this batch yet.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Roll Number</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {selectedBatchData?.students.map((student) => (
                      <tr key={student.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          {student.rollNumber}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {student.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {student.email || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderAttendanceMarking = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">Mark Attendance</h3>
            <p className="mt-1 text-sm text-gray-500">Select a batch to mark attendance</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Batch
            </label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">Select a batch</option>
              {batches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedBatch && selectedBatchData && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">Mark Attendance</h3>
              <p className="mt-1 text-sm text-gray-500">
                {format(new Date(), 'MMMM dd, yyyy')}
              </p>
            </div>

            {selectedBatchData.students.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Students Enrolled</h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are no students enrolled in this batch yet.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Roll Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedBatchData.students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.rollNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleAttendanceChange(student.id)}
                              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                                attendance[student.id]
                                  ? 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100'
                                  : 'border-red-500 text-red-700 bg-red-50 hover:bg-red-100'
                              }`}
                            >
                              {attendance[student.id] ? (
                                <CheckCircle className="h-5 w-5 mr-1" />
                              ) : (
                                <XCircle className="h-5 w-5 mr-1" />
                              )}
                              {attendance[student.id] ? 'Present' : 'Absent'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleSubmit}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit Attendance
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {!attendanceSubmitted ? (
        <>
          <div className="mb-6">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setViewMode('attendance');
                  setSelectedBatch('');
                }}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'attendance'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <ClipboardCheck className="h-5 w-5 mr-2" />
                Mark Attendance
              </button>
              <button
                onClick={() => {
                  setViewMode('students');
                  setSelectedBatch('');
                }}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'students'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <Users className="h-5 w-5 mr-2" />
                View Students
              </button>
            </div>
          </div>

          {viewMode === 'attendance' ? renderAttendanceMarking() : renderStudentList()}
        </>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-2 text-xl font-medium text-gray-900">
            Attendance Submitted Successfully
          </h3>
          <div className="mt-4">
            <button
              onClick={() => {
                setAttendanceSubmitted(false);
                setSelectedBatch('');
                setAttendance({});
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Mark Another Batch
            </button>
          </div>
        </div>
      )}

      {showReport && selectedBatchData && (
        <AttendanceReport
          batchName={selectedBatchData.name}
          students={selectedBatchData.students}
          attendance={attendance}
          onClose={() => {
            setShowReport(false);
            setAttendanceSubmitted(false);
            setSelectedBatch('');
            setAttendance({});
          }}
        />
      )}
    </div>
  );
}

TeacherDashboard.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      rollNumber: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string
    })
  )
};

export default TeacherDashboard;