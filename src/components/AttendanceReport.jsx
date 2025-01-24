import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Download, X, CheckCircle, XCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AttendanceReport({ batchName, students, attendance, onClose }) {
  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = students.length - presentCount;
  const attendancePercentage = students.length > 0 ? (presentCount / students.length) * 100 : 0;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const currentDate = format(new Date(), 'MMMM dd, yyyy');

    doc.setFontSize(20);
    doc.text('Attendance Report', 105, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Batch: ${batchName}`, 20, 30);
    doc.text(`Date: ${currentDate}`, 20, 37);

    doc.setFontSize(12);
    doc.text('Attendance Statistics:', 20, 50);
    doc.text(`Present: ${presentCount} students`, 30, 57);
    doc.text(`Absent: ${absentCount} students`, 30, 64);
    doc.text(`Attendance Rate: ${attendancePercentage.toFixed(1)}%`, 30, 71);

    const tableData = students.map(student => [
      student.rollNumber,
      student.name,
      attendance[student.id] ? 'Present' : 'Absent'
    ]);

    autoTable(doc, {
      startY: 80,
      head: [['Roll Number', 'Name', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontSize: 12,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 11,
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    doc.save(`attendance-${batchName.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full m-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Attendance Report - {batchName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-800 text-sm font-medium">Present</div>
              <div className="text-2xl font-bold text-green-900">{presentCount}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-red-800 text-sm font-medium">Absent</div>
              <div className="text-2xl font-bold text-red-900">{absentCount}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-800 text-sm font-medium">Attendance Rate</div>
              <div className="text-2xl font-bold text-blue-900">
                {attendancePercentage.toFixed(1)}%
              </div>
            </div>
          </div>

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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map(student => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        attendance[student.id]
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {attendance[student.id] ? (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1" />
                        )}
                        {attendance[student.id] ? 'Present' : 'Absent'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

AttendanceReport.propTypes = {
  batchName: PropTypes.string.isRequired,
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      rollNumber: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  attendance: PropTypes.objectOf(PropTypes.bool).isRequired,
  onClose: PropTypes.func.isRequired
};