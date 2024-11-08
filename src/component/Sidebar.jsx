// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTh, FaUserCog, FaClipboardList,FaProjectDiagram,} from 'react-icons/fa';
import logo from '../Assets/logo.jpg'; // Import your logo image



const Sidebar = () => {
  return (
    <div className="fixed m-4 rounded-lg bg-white text-black w-64 border border-[#A5A4A4] h-[97%]">
      {/* Logo Section */}
      <div className="p-2 flex items-center justify-center">
        <img src={logo} alt="Logo" className="h-22 w-full" /> {/* Adjust the size of the logo here */}
      </div>

      {/* Sidebar Menu */}
      <ul className="space-y-6 p-4">
        <Link to="/assets" className="flex items-center space-x-3 cursor-pointer">
          <FaTh /> <span>Assets</span>
        </Link>

        <Link to="/categories" className="flex items-center space-x-3 cursor-pointer">
          <FaClipboardList /> <span>Add Category</span>
        </Link>

        <Link to="/Approval" className="flex items-center space-x-3 cursor-pointer">
          <FaUserCog /> <span>Approval Authority</span>
        </Link>
      
        <Link to="/Workflow" className="flex items-center space-x-3 cursor-pointer">
          
          <FaProjectDiagram /> <span>Workflow</span>
        </Link>
        <Link to="/Depreciation" className="flex items-center space-x-3 cursor-pointer">
          <FaUserCog /> <span>Depreciation</span>
        </Link>
        <li className="flex items-center space-x-3 cursor-pointer">
          <FaClipboardList /> <span>Audit Logs</span>
        </li>
     

      </ul>
    </div>
  );
};

export default Sidebar;
