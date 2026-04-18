import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { motion } from 'framer-motion';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#0c0c0c]">
      <Sidebar />
      
      <main className="flex-1 p-10 overflow-auto">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};
