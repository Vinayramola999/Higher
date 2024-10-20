import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssetManagementPage = () => {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [dynamicFields, setDynamicFields] = useState([]); // Array to store dynamic fields from columns
  const [formData, setFormData] = useState({});

  const assets = [
    {
      name: 'ASUS VIVOBOOK A15',
      category: 'Laptop',
      Quantity: '10',
    },
    // Add more assets here
  ];

  // Fetch categories and dynamic fields when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://higher.co.in:9898/api/categories/fetch");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Fetch dynamic fields based on the selected category
    if (name === 'category') {
      fetchDynamicFields(value);
    }
  };

  const fetchDynamicFields = async (categoryName) => {
    try {
      const response = await axios.get(`http://higher.co.in:9898/api/tables/table-data/${categoryName}`);
      const { columns } = response.data;

      // Extract and set dynamic fields
      setDynamicFields(columns);
    } catch (error) {
      console.error("Error fetching dynamic fields:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setIsAssetModalOpen(false);
  };

  return (
    <div className="p-8 flex flex-col space-y-6 min-h-screen">
      <div className="flex justify-between">
        <button onClick={() => setIsAssetModalOpen(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          + Add Asset
        </button>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg"
          />
        </div>
      </div>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-4 py-2 border">Asset Name</th>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Quantity</th>
            <th className="px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => (
            <tr key={index} className="even:bg-gray-100">
              <td className="px-4 py-2 border">{asset.name}</td>
              <td className="px-4 py-2 border">{asset.category}</td>
              <td className="px-4 py-2 border">{asset.Quantity}</td>
              <td className="px-4 py-2 border">
                <button className="text-blue-600 mx-2">ℹ️</button>
                <button className="text-green-600 mx-2">✏️</button>
                <button className="text-red-600 mx-2">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAssetModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
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
                <select
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  className="p-2 rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-[#F0F0F0]"
                >
                  <option value="">Select a category</option>
                  {categories.map((category, i) => (
                    <option key={i} value={category.categoriesname}>
                      {category.categoriesname}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Fields Render */}
              {dynamicFields.length > 0 ? (
                dynamicFields.map((field, index) => (
                  <div key={index} className="flex flex-col">
                    <label htmlFor={field} className="mb-1 text-sm font-medium text-gray-700">
                      {field} {/* Assuming field name is the label */}
                    </label>
                    <input
                      type="text" // You can modify this to the appropriate field type if available
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      className="p-2 rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-[#F0F0F0]"
                      required
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-sm text-gray-500">No dynamic fields available for this category</div>
              )}

              <div className="col-span-2 flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsAssetModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagementPage;
