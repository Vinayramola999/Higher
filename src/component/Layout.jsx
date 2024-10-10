import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <div className="ml-auto w-[calc(100%-274px)]">
        <Navbar />
        {children}
      </div>
    </>
  );
};

export default Layout;
