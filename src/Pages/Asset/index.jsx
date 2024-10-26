// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AssetManagementPage = () => {
//   const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [dynamicFields, setDynamicFields] = useState([]); // For dynamic form fields
//   const [formData, setFormData] = useState({});
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [assets, setAssets] = useState([]); // State to hold assets

//   // Fetch categories when the component mounts
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get("http://higherindia.net:9898/api/categories/fetch");
//         setCategories(response.data || []);
//       } catch (error) {
//         console.error("Error fetching categories:", error.message);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Fetch dynamic fields based on the selected category
//   const fetchDynamicFields = async (categoryName) => {
//     try {
//       const response = await axios.get(`http://higherindia.net:9898/api/tables/table-data/${categoryName}`);
//       setDynamicFields(response.data?.columns || []);
//     } catch (error) {
//       console.error("Error fetching dynamic fields:", error.message);
//     }
//   };

 
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     if (name === 'category') {
//       setSelectedCategory(value);
//       fetchDynamicFields(value);
//     }
//   };
  
  

  
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
    
//   //   try {
//   //     // Ensure data is sent as a JSON object
//   //     const response = await axios.post(`http://higherindia.net:9898/api/tables/insert/${selectedCategory}`, formData, {
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //     });

//   //     console.log('Form submitted successfully:', response.data);

//   //     // Update assets table with the newly added data
//   //     setAssets([...assets, formData]);

//   //     // Close the modal after submission
//   //     setIsAssetModalOpen(false);
//   //   } catch (error) {
//   //     console.error("Error submitting form:", error.message);
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       // Create a new payload without the 'category' field
//       const { category, ...payloadToSend } = formData;
  
//       // Ensure data is sent as a JSON object
//       const response = await axios.post(`http://higherindia.net:9898/api/tables/insert/${selectedCategory}`, payloadToSend, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
  
//       console.log('Form submitted successfully:', response.data);
  
//       // Update assets table with the newly added data
//       setAssets([...assets, payloadToSend]);
  
//       // Close the modal after submission
//       setIsAssetModalOpen(false);
//     } catch (error) {
//       console.error("Error submitting form:", error.message);
//     }
//   };
  

//   return (
//     <div className="p-4 md:p-8 flex flex-col space-y-6 min-h-screen">
//       <div className="flex justify-between">
//         <button
//           onClick={() => setIsAssetModalOpen(true)}
//           className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg"
//         >
//           + Add Asset
//         </button>
//         <div className="flex space-x-2 md:space-x-3">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="px-3 py-2 border rounded-lg w-full md:w-auto"
//           />
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full table-auto border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-blue-600 text-white">
//               <th className="px-2 md:px-4 py-2 border">Asset Name</th>
//               <th className="px-2 md:px-4 py-2 border">Category</th>
//               <th className="px-2 md:px-4 py-2 border">Quantity</th>
//               <th className="px-2 md:px-4 py-2 border">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {assets.map((asset, index) => (
//               <tr key={index} className="even:bg-gray-100">
//                 <td className="px-2 md:px-4 py-2 border">{asset.name}</td>
//                 <td className="px-2 md:px-4 py-2 border">{asset.category}</td>
//                 <td className="px-2 md:px-4 py-2 border">{asset.Quantity}</td>
//                 <td className="px-2 md:px-4 py-2 border">
//                   <button className="text-blue-600 mx-1 md:mx-2">ℹ️</button>
//                   <button className="text-green-600 mx-1 md:mx-2">✏️</button>
//                   <button className="text-red-600 mx-1 md:mx-2">🗑️</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal Section */}
//       {isAssetModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
//             <div className="flex justify-between items-center bg-gray-100 p-4 rounded-t-lg">
//               <h2 className="text-lg font-semibold text-gray-800">Add Asset</h2>
//               <button onClick={() => setIsAssetModalOpen(false)} className="text-red-500">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="flex flex-col">
//                 <label htmlFor="category" className="mb-1 text-sm font-medium text-gray-700">Category</label>
//                 <select
//                   name="category"
//                   value={selectedCategory}
//                   onChange={handleChange}
//                   className="p-2 rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-[#F0F0F0]"
//                   required
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map((category, i) => (
//                     <option key={i} value={category.categoriesname}>
//                       {category.categoriesname}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Dynamic Fields Render */}
//               {dynamicFields.length > 0 ? (
//                 dynamicFields.map((field, index) => (
//                   <div key={index} className="flex flex-col">
//                     <label htmlFor={field} className="mb-1 text-sm font-medium text-gray-700">
//                       {field}
//                     </label>
//                     <input
//                       type="text"
//                       name={field}
//                       value={formData[field] || ""}
//                       onChange={handleChange}
//                       className="p-2 rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-[#F0F0F0]"
//                       required
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <div className="col-span-2 text-center text-sm text-gray-500">
//                   No dynamic fields available for this category
//                 </div>
//               )}

//               <div className="col-span-2 flex justify-end mt-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsAssetModalOpen(false)}
//                   className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded mr-2"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssetManagementPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssetManagementPage = () => {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [dynamicFields, setDynamicFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tableData, setTableData] = useState({ columns: [], data: [] });
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredData, setFilteredData] = useState([]); // State for filtered table data

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://higherindia.net:9898/api/categories/fetch");
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  // Fetch dynamic fields and table data based on the selected category
  const fetchTableData = async (categoryName) => {
    try {
      const response = await axios.get(`http://higherindia.net:9898/api/tables/table-data/${categoryName}`);
      setTableData({
        columns: response.data.columns || [],
        data: response.data.data || []
      });
      setDynamicFields(response.data.columns || []);
      setFilteredData(response.data.data || []); // Initialize filtered data
    } catch (error) {
      console.error("Error fetching table data:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'category') {
      setSelectedCategory(value);
      fetchTableData(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { category, ...payloadToSend } = formData;
      const response = await axios.post(`http://higherindia.net:9898/api/tables/insert/${selectedCategory}`, payloadToSend, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Form submitted successfully:', response.data);

      await fetchTableData(selectedCategory);
      setIsAssetModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  // Handle search term changes and update filtered data
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = tableData.data.filter((row) =>
      Object.values(row).some((val) => 
        val.toString().toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  return (
    <div className="p-4 md:p-5 flex flex-col space-y-6 min-h-screen">
  {/* Add Asset Button, Category Dropdown, and Search Input */}
  <div className="flex items-center justify-between flex-wrap space-y-4 md:space-y-0">
    {/* Left Section: Add Asset Button and Category Dropdown */}
    <div className="flex items-center space-x-4">
      <button 
        onClick={() => setIsAssetModalOpen(true)} 
        className="bg-blue-600 text-white px-4 py-2 rounded-lg w-[200px]"
      >
        + Add Asset
      </button>

      <div className="flex flex-col">
        <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-700"></label>
        <select
          name="category"
          value={selectedCategory}
          onChange={handleChange}
          className="p-2 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-[#F0F0F0] w-[200px] "
          required
        >
          <option value="">Select a category</option>
          {categories.map((category, i) => (
            <option key={i} value={category.categoriesname}>{category.categoriesname}</option>
          ))}
        </select>
      </div>
    </div>

    {/* Right Section: Search Bar */}
    <div className="w-full md:w-1/3 lg:w-1/4 mt-4 md:mt-0">
      <input 
        type="text" 
        placeholder="Search..." 
        className="px-3 py-2 border rounded-lg w-[300px]" 
        value={searchTerm} 
        onChange={handleSearch}
      />
    </div>
  </div>



      {/* Table Section */}
      <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-600 text-white">
            {tableData.columns.map((column, index) => (
              <th key={index} className="px-2 md:px-4 py-2 border">
                {column}
              </th>
            ))}
            <th className="px-2 md:px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index} className="even:bg-gray-100">
              {tableData.columns.map((column, colIndex) => (
                <td key={colIndex} className="px-2 md:px-4 py-2 border">
                  {row[column] || ""}
                </td>
              ))}
              <td className="px-2 md:px-4 py-2 border">
                <button className="text-blue-600 mx-1 md:mx-2">ℹ️</button>
                <button className="text-green-600 mx-1 md:mx-2">✏️</button>
                <button className="text-red-600 mx-1 md:mx-2">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Modal Section */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-t-lg">
              <h2 className="text-lg font-semibold text-gray-800">Add Asset</h2>
              <button onClick={() => setIsAssetModalOpen(false)} className="text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="category" className="mb-1 text-sm font-medium text-gray-700">Category</label>



                <select name="category" value={selectedCategory} onChange={handleChange} className="p-2 rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-[#F0F0F0]" required>
                  <option value="">Select a category</option>
                  {categories.map((category, i) => (
                    <option key={i} value={category.categoriesname}>{category.categoriesname}</option>
                  ))}
                </select>
              </div>
              {dynamicFields.map((field, index) => (
                <div key={index} className="flex flex-col">
                  <label htmlFor={field} className="mb-1 text-sm font-medium text-gray-700">{field}</label>
                  <input type="text" name={field} value={formData[field] || ""} onChange={handleChange} className="p-2 rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-[#F0F0F0]" required />
                </div>
              ))}
              <div className="col-span-2 flex justify-end mt-4">
                <button type="button" onClick={() => setIsAssetModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded mr-2">Cancel</button>
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagementPage;
