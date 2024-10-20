// App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Sidebar from './component/Sidebar';
import Navbar from './component/Navbar';
import AssetManagementPage from './Pages/Asset';
import Category from './Pages/Category';
import Layout from './component/Layout';
import WorkflowPage from './Pages/Workflow';
import ApprovalAuthority from './Pages/ApprovalAuthority';
import Depreciation from './Pages/Depreciation';


function App() {
  return (
    <div className="bg-[#FBFCF8] flex" >
      <Router>
        <Routes>
          <Route path="/assets" element={<Layout><AssetManagementPage /></Layout>} />
          <Route path="/categories" element={<Layout><Category /></Layout>} />
          <Route path="/Approval" element={<Layout><ApprovalAuthority /></Layout>} />
          <Route path="/Workflow" element={<Layout><WorkflowPage /></Layout>} />
          <Route path="/Depreciation" element={<Layout><Depreciation /></Layout>} />
          
         
        </Routes>
    </Router>
    </div>
  );
}

export default App;
