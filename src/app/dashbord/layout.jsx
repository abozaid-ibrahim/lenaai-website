import Header from '@/components/dashbord/common/Header';
import Sidebar from '@/components/dashbord/common/Sidebar';
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden  lg:pl-0">
        {/* Top Navigation */}
        <Header />
        
        {/* Main Content */}
        <main className=" overflow-y-auto p-4 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
