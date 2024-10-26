import React, { useState, useEffect } from 'react';

const DepreciationPage = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('WDV');
  const [showModal, setShowModal] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://higherindia.net:9898/api/categories/fetch');
        const data = await response.json();
        setCategories(data); // Adjust based on actual response structure
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'view') {
      setShowModal(true); // Open modal when switching to View Depreciation
    } else {
      setShowModal(false); // Close modal when switching back to Setup
      setShowTable(false); // Ensure table is hidden when in Setup
    }
  };

  const handleSubmit = () => {
    setShowModal(false);
    setShowTable(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
    {/* Tabs */}
    <div className="relative flex justify-left space-x-8 mb-6 border-b border-gray-300">
      <button
        className={`px-6 py-2 text-sm md:text-lg font-semibold relative focus:outline-none transition duration-300 ${
          activeTab === 'setup' ? 'text-blue-600' : 'text-gray-600'
        }`}
        onClick={() => handleTabSwitch('setup')}
      >
        Setup WDV
        {activeTab === 'setup' && (
          <div className="absolute left-0 right-0 h-1 bg-blue-600 bottom-0 transition-all duration-300"></div>
        )}
      </button>

      <button
        className={`px-6 py-2 text-sm md:text-lg font-semibold relative focus:outline-none transition duration-300 ${
          activeTab === 'view' ? 'text-blue-600' : 'text-gray-600'
        }`}
        onClick={() => handleTabSwitch('view')}
      >
        View Depreciation
        {activeTab === 'view' && (
          <div className="absolute left-0 right-0 h-1 bg-blue-600 bottom-0 transition-all duration-300"></div>
        )}
      </button>
    </div>

      {/* Main Content */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        {activeTab === 'setup' ? (
          <div>
            {/* Form for setting up depreciation */}
            <div className="flex md:grid-cols-3 gap-4 mb-7">
              <div className="flex flex-col">
                <label htmlFor="category" className="mb-2 text-gray-700 font-semibold">
                  Select Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 w-[250px]"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((category, i) => (
                    <option key={i} value={category.categoriesname}>
                      {category.categoriesname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="depreciation" className="mb-2 text-gray-700 font-semibold">
                  Depreciation Value (%)
                </label>
                <div className="flex items-center">
                  <input
                    id="depreciation"
                    type="number"
                    placeholder="Enter Dep Value"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 w-[250px]"
                  />
                  {/* <span className="ml-2">%</span> */}
                </div>
              </div>

              {/* Date Range Inputs */}
              <div className="flex flex-col">
                <label htmlFor="startDate" className="mb-2 text-gray-700 font-semibold">
                  Estimated Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 w-[250px]"
                />
              </div>

              

              <div className="flex items-end">
                <button className="w-[250px] px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300">
                  Submit
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto  ">
              <table className="w-full table-auto border-collapse">
                <thead >
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Sr. No.</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Category</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Depreciation [%]</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Estimated Date</th>
                   
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Time Stamp</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Created By</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example Data Row */}
                  <tr className="bg-white odd:bg-gray-50">
                    <td className="px-4 py-2 border text-gray-700">1</td>
                    <td className="px-4 py-2 border text-gray-700">Category Name XYZ</td>
                    <td className="px-4 py-2 border text-gray-700">67%</td>
                    <td className="px-4 py-2 border text-gray-700">01-01-2024</td>
                   
                    <td className="px-4 py-2 border text-gray-700">02-05-2024 2:30:54 PM</td>
                    <td className="px-4 py-2 border text-gray-700">sumit@123</td>
                    <td className="px-4 py-2 border">
                      <button className="text-blue-600 hover:underline mr-2">✏️</button>
                      <button className="text-red-600 hover:underline">🗑️</button>
                    </td>
                  </tr>
                  {/* Repeat for more rows */}
                </tbody>
              </table>
            </div>
          </div>
          
        ) : (
          
          <div>
            
            {/* Modal for Depreciation Method Selection */}
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[800px]">
                  <h2 className="text-lg font-bold mb-4">Select Method</h2>
                  <div className="mb-4">
                    <label>
                      <input
                        type="radio"
                        value="WDV"
                        checked={selectedMethod === 'WDV'}
                        onChange={() => setSelectedMethod('WDV')}
                        className="mr-2"
                      />
                      WDV
                    </label>
                  </div>
                  <div className="mb-4">
                    <label>
                      <input
                        type="radio"
                        value="SLM"
                        checked={selectedMethod === 'SLM'}
                        onChange={() => setSelectedMethod('SLM')}
                        className="mr-2"
                      />
                      SLM
                    </label>
                  </div>
                  <div className="flex flex-col mb-4">
                    <label className="text-gray-700">Select Asset:</label>
                    <select className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200">
                      <option value="">-- Select Asset --</option>
                      {/* Populate asset options here */}
                    </select>
                  </div>
                  <div className="flex flex-col mb-4">
                    <label htmlFor="category" className="mb-2 text-gray-700 font-semibold">
                      Select Category
                    </label>
                    <select
                      id="category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((category, i) => (
                        <option key={i} value={category.categoriesname}>
                          {category.categoriesname}
                        </option>
                      ))}
                      
                    </select>
                    
                  </div>
                  <div className="flex justify-end">
                  <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 mr-20"
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Modal for Depreciation Method Selection */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[800px]">
      <h2 className="text-lg font-bold mb-4">Select Method</h2>
      <div className="mb-4">
        <label>
          <input
            type="radio"
            value="WDV"
            checked={selectedMethod === 'WDV'}
            onChange={() => setSelectedMethod('WDV')}
            className="mr-2"
          />
          WDV
        </label>
      </div>
      <div className="mb-4">
        <label>
          <input
            type="radio"
            value="SLM"
            checked={selectedMethod === 'SLM'}
            onChange={() => setSelectedMethod('SLM')}
            className="mr-2"
          />
          SLM
        </label>
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-gray-700">Select Asset:</label>
        <select className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200">
          <option value="">-- Select Asset --</option>
          {/* Populate asset options here */}
        </select>
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="category" className="mb-2 text-gray-700 font-semibold">
          Select Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        >
          <option value="">-- Select Category --</option>
          {categories.map((category, i) => (
            <option key={i} value={category.categoriesname}>
              {category.categoriesname}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 mr-20"
        >
          Cancel
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  </div>
  
  
)}




            {/* Table for Depreciation Data */}
            
            {showTable && 
            (
              <div className="overflow-x-auto">
                
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">Sr. No.</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">Category</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">Asset</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">Cost</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">Depreciated value</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">Time stamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Example Data Row */}
                    <tr className="bg-white odd:bg-gray-50">
                      <td className="px-4 py-2 border text-gray-700">1</td>
                      <td className="px-4 py-2 border text-gray-700">Category Name XYZ</td>
                      <td className="px-4 py-2 border text-gray-700">Laptop</td>
                      <td className="px-4 py-2 border text-gray-700">$5000</td>
                      <td className="px-4 py-2 border text-gray-700">$4000</td>

                      <td className="px-4 py-2 border text-gray-700">02-05-2024 2:30:54 PM</td>
                    </tr>
                    {/* Repeat for more rows */}
                  </tbody>
                </table>
                
              </div>
            )}
          </div>
        )}
      </div>
    </div>
              

  );
};

export default DepreciationPage;
