import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { LogIn, ClipboardCheck } from 'lucide-react';

export function NavigationButtons({ showAttendanceTracker, setShowAttendanceTracker }) {
  return (
    <motion.div 
      className="flex justify-center space-x-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        onClick={() => setShowAttendanceTracker(false)}
        className={`group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${!showAttendanceTracker ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <LogIn className="h-4 w-4 mr-2" />
        Login
      </motion.button>
      <motion.button
        onClick={() => setShowAttendanceTracker(true)}
        className={`group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${showAttendanceTracker ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ClipboardCheck className="h-4 w-4 mr-2" />
        Check Attendance
      </motion.button>
    </motion.div>
  );
}

NavigationButtons.propTypes = {
  showAttendanceTracker: PropTypes.bool.isRequired,
  setShowAttendanceTracker: PropTypes.func.isRequired
};

export default NavigationButtons;