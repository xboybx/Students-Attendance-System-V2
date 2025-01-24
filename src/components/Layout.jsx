import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, UserCircle } from 'lucide-react';

export function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen relative">
      <div className="geometric-background">
        <div className="geometric-shape shape-1"></div>
        <div className="geometric-shape shape-2"></div>
        <div className="geometric-shape shape-3"></div>
      </div>

      {!isAuthPage && (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="nav-minimal"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h1 className="text-xl font-bold">
                  Attendance System
                </h1>
              </motion.div>
              
              <div className="flex items-center space-x-6">
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <UserCircle className="h-6 w-6" />
                  <span className="text-sm">
                    {user.email}
                  </span>
                </motion.div>
                <motion.button
                  onClick={handleLogout}
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="h-5 w-5 mr-2 inline-block" />
                  Logout
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>
      )}

      <main className={`relative z-10 ${isAuthPage ? '' : 'pt-24'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;