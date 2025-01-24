import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Search, Calendar, Percent, User, BookOpen } from 'lucide-react';

export default function AttendanceTracker() {
  const [rollNumber, setRollNumber] = useState('');
  const [studentDetails, setStudentDetails] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [error, setError] = useState('');

  const fetchStudentDetails = () => {
    setError('');
    
    // Search through all batch enrollments
    const batches = ['CSE2024', 'ECE2024'];
    let foundStudent = null;

    for (const batchName of batches) {
      const batchKey = `batch_${batchName}`;
      const students = JSON.parse(localStorage.getItem(batchKey) || '[]');
      const student = students.find(s => s.rollNumber === rollNumber);
      
      if (student) {
        foundStudent = {
          name: student.name,
          rollNumber: student.rollNumber,
          batch: batchName.replace(/(\d+)/, ' $1'),
          email: student.email || 'Not provided'
        };
        break;
      }
    }

    if (!foundStudent) {
      setError('Student not found');
      setStudentDetails(null);
      setAttendanceData([]);
      return;
    }

    setStudentDetails(foundStudent);
    fetchAttendanceData(foundStudent.batch.replace(/\s+/g, ''));
  };

  const fetchAttendanceData = (batchId) => {
    const monthStart = startOfMonth(new Date(selectedMonth));
    const monthEnd = endOfMonth(monthStart);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const monthlyAttendance = [];

    daysInMonth.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const attendanceKey = `attendance_${batchId}_${dateStr}`;
      const dayAttendance = JSON.parse(localStorage.getItem(attendanceKey) || '{}');
      
      // Find the student's ID from the batch data
      const batchKey = `batch_${batchId}`;
      const batchData = JSON.parse(localStorage.getItem(batchKey) || '[]');
      const student = batchData.find(s => s.rollNumber === rollNumber);

      if (student && dayAttendance[student.id] !== undefined) {
        monthlyAttendance.push({
          date: dateStr,
          present: dayAttendance[student.id]
        });
      }
    });

    setAttendanceData(monthlyAttendance);
  };

  const calculateAttendance = () => {
    if (attendanceData.length === 0) return 0;
    const presentDays = attendanceData.filter(day => day.present).length;
    return (presentDays / attendanceData.length) * 100;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Roll Number
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
              placeholder="e.g., CSE001"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={fetchStudentDetails}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Check Attendance
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {studentDetails && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Student Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Name:</span>
                <span className="font-medium">{studentDetails.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Batch:</span>
                <span className="font-medium">{studentDetails.batch}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Monthly Attendance</h3>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  if (studentDetails) {
                    fetchAttendanceData(studentDetails.batch.replace(/\s+/g, ''));
                  }
                }}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-green-800">Monthly Attendance</span>
                  </div>
                  <span className="text-2xl font-bold text-green-900">
                    {calculateAttendance().toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Percent className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium text-blue-800">Days Present</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-900">
                    {attendanceData.filter(day => day.present).length}/{attendanceData.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {attendanceData.map((record) => (
                    <tr key={record.date}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                        {format(new Date(record.date), 'MMMM d, yyyy')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.present
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.present ? 'Present' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {attendanceData.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-3 py-4 text-sm text-gray-500 text-center">
                        No attendance records found for this month
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}