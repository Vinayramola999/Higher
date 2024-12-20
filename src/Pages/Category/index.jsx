import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaTimes, FaSave } from "react-icons/fa";

const Category = () => {
  const [categoryData, setCategoryData] = useState({
    categoryName: "",
    categoryType: "Select Type",
    workflowname: "Select Workflow",
    approvalrole: "Approvers Role", // Initialize approversRole

    createdBy: "Admin",
  });
  
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [existingFields, setExistingFields] = useState([]);
  const [newFields, setNewFields] = useState([{ fieldname: "", assetDataType: "String", isUnique: false, isNullable: false }]);
  const [roles, setRoles] = useState([]);
const [selectedRole, setSelectedRole] = useState('');
const [selectedWorkflow, setSelectedWorkflow] = useState('');
const [workflows, setWorkflows] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const[selectedApprovalRole, setSelectedApprovalRole]= useState('');
const filteredCategories = categories.filter(category =>
  category.categoriesname?.toLowerCase().includes(searchTerm.toLowerCase()));
 

        
   
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [isTempModalOpen, setIsTempModalOpen] = useState(false);
  const modalRef = useRef(null);
  const [categoryFields, setCategoryFields] = useState([])
  const [updatedOn, setUpdatedOn] =  useState(null);
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchCategoryFields()
    ;
    
  }, [updatedOn]);
  useEffect(() => {
    if (isEditCategoryModalOpen , categories) {
      axios.get('http://higherindia.net:3001/role')
        .then(response => {
          if (response && response.data) {
            setRoles(response.data);
          }
        })
        .catch(error => {
          console.error('Error fetching roles:', error);
        });
    }
  }, [isEditCategoryModalOpen, categories]);
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await axios.get('http://higherindia.net:9898/workflow/get');
        if (response && response.data) {
          setWorkflows(response.data);  // Assuming workflows are returned in response.data
        }
      } catch (error) {
        console.error('Error fetching workflows:', error);
      }
    };

    fetchWorkflows();
  }, []);  // Empty dependency array means this effect runs once on component mount
  
  

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://higherindia.net:9898/api/categories/fetch");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCategoryFields = async () => {
    try {
      const response = await axios.get("http://higherindia.net:9898/api/assets/fetch");
      console.log( "response", response.data)
      setExistingFields(response.data);
    } catch (error) {
      console.error("Error fetching categories fields:", error);
    }
  };
  



  const handleApprovalRoleChange = (e) => {
    setSelectedApprovalRole(e.target.value);
};
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  // Handle changes for existing fields
  const handleExistingFieldChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedFields = [...existingFields];
    updatedFields[index][name] = type === "checkbox" ? checked : value;
    setExistingFields(updatedFields);
  };

  // Handle changes for new fields
  const handleNewFieldChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedFields = [...newFields];
    updatedFields[index][name] = type === "checkbox" ? checked : value;
    setNewFields(updatedFields);
  }

  const addField = () => {
    const newField = { fieldname: "", assetDataType: "String", isUnique: false, isNullable: false };
    
    setNewFields([...newFields, newField]);
  };

  const removeField = (index) => {
    setNewFields(newFields.filter((_, i) => i !== index));
  };
  const removeExistingField = async (id) => {
    try {
      await axios.delete(`http://higherindia.net.in:9898/api/assets/${id}`);
      window.location.reload()
      
      setUpdatedOn((prev) => prev + 1);
    } catch (error) {
      console.error("Error deleting category:", error);
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCategory = {

        categoriesname: categoryData.categoryName,
        description: categoryData.categoryType,
        workflowname: categoryData.workflowname,
        approvalrole: categoryData.approvalrole,
        Created_by:  categoryData. createdBy,

        fields: [...existingFields, ...newFields],
       
      };
      const response = await axios.post("http://higherindia.net:9898/api/categories/add", newCategory);
      setUpdatedOn(new Date());
      setCategories([...categories, response.data]);
       resetForm();
       alert("Category added successfully!");
    } catch (error) {
      alert("Error adding category. Please try again.");
      console.error("Error adding category:", error);
    }
  };
  // const closeModal = () => {
  //   setIsEditCategoryModalOpen(false);
  //   resetForm(); // Reset the form fields when closing the modal
  // }

  const resetForm = () => {
    setCategoryData({ categoryName: "", categoryType: "Select Type", workflowname:"Select Workflow ",approvalrole:"Approvers Role", createdBy:"Admin " });
    setNewFields([{ fieldname: "", assetDataType: "String", isUnique: false,isNullable: false }]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://higherindia.net:9898/api/categories/delete/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
      setUpdatedOn((prev) => prev + 1);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  
  };

  const handleTemporarySave = async (category) => {
    try {
      const temporaryData = {
        categoryName: selectedCategoryName,
        assets: newFields,
      };
  
      console.log("Temporary Save Data:", temporaryData); // Log the data being sent
  
      const response = await axios.post("http://higherindia.net:9898/api/assets/insert", temporaryData);
      
      console.log("Response from Temporary Save:", response.data); // Log response for confirmation
      setIsTempModalOpen(true);
      console.log("Category temporarily saved:", temporaryData);
  
    } catch (error) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Error in setting up request:", error.message);
      }
    }
  };
  

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedCategory = {
        categoryName: selectedCategoryName,
        fields: newFields.reduce((acc, field) => {
          acc[field.fieldname] = field.assetDataType + 
            (field.isUnique ? ", UNIQUE" : "") + 
            (field.isNullable ? ", NULL" : "");
          return acc;
        }, {}),
      };
  
      console.log("Updated Category Data:", updatedCategory); // Log data being submitted
  
      const response = await axios.post("http://higherindia.net:9898/api/temp/save", updatedCategory);
      
      console.log("Response from Save:", response.data); // Log response from server
      closeModal();
      fetchCategories();
    } catch (error) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Error in setting up request:", error.message);
      }
    }
  };
  console.log({existingFields, newFields})

  const handlePublish = async () => {
    console.log("handle publish")
    try {
        // Construct the publish data

        let updatedFieldsData = newFields.reduce((acc, field) => {
          acc[field.fieldname] = `${field.assetDataType}${field.isNullable ? ",NULL" : ",NOT NULL"}`;
          return acc;
        }, {})

        for (let data of existingFields) {
          updatedFieldsData[data.fieldname] = `${data.assetDataType}${data.isNullable ? ",NULL" : ",NOT NULL"}`
        }

        // updatedFieldsData["roles"] ="admin"

        const publishData = {
            categoryName: selectedCategoryName,
            fields: updatedFieldsData
        };

        console.log("Publishing Data:", publishData); // Log the data being sent

        const response = await axios.post("http://higherindia.net:9898/api/tables/publish", publishData);

        console.log("Response from Publish:", response.data); // Log response for confirmation
        closeModal();
        fetchCategories(); // Fetch categories again to refresh the list
        alert("Category published successfully!");
    } catch (error) {
      console.log({
        error
      })
        if (error.response) {
            console.error("Error response from server:", error.response.data);
        } else if (error.request) {
            console.error("No response received from server:", error.request);
        } else {
            console.error("Error in setting up request:", error.message);
        }
        alert("Failed to publish the category. Please try again.");
    }
};

  

  const openEditModal  = (category) => {
    setSelectedCategoryName(category.categoriesname);
    setEditCategoryId(category.categoryId);
    setIsEditCategoryModalOpen(true);
  

    const filterCategoryFields = existingFields.filter(c => c.categoryName === category.categoriesname);
    console.log({filterCategoryFields},{category})

    setExistingFields(filterCategoryFields.length
      ? filterCategoryFields.map(c => ({ id:c.id, fieldname: c.fieldname, assetDataType: c.assetDataType, isUnique: c.isUnique, isNullable: c.isNullable }))
      : 
      []
    );

    setNewFields(!filterCategoryFields.length?[
      { fieldname: "Assertname", assetDataType: "String", isUnique: false, isNullable: false },
      { fieldname: "dateOfPurchase", assetDataType: "String", isUnique: false, isNullable: false },
      { fieldname: "original coast", assetDataType: "String", isUnique: false, isNullable: false },
      { fieldname: "scrapvalue", assetDataType: "Number", isUnique: false, isNullable: false },
      { fieldname: "usefullife", assetDataType: "Number", isUnique: false, isNullable: false },
    ]:[{ fieldname: "", assetDataType: "String", isUnique: false, isNullable: false }]);  // Reset new fields
    
  };
  
                    
  const closeModal = () => {
    setIsEditCategoryModalOpen(false);
    setNewFields([{ fieldname: "", assetDataType: "String", isUnique: false, isNullable: false }
      
    ]);
    
  };
  

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    if (isEditCategoryModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditCategoryModalOpen]);


  
  return (
    <div className="p-5 bg-grey-100">
      <div className="bg-white p-4 rounded-lg shadow-md">
        {/* <h2 className="text-lg font-semibold mb-4">Add Category</h2> */}
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <label className="text-[#555252]">Category Name</label>
            <input
              type="text"
              name="categoryName"
              value={categoryData.categoryName}
              onChange={handleInputChange}
              className="p-2 w-[200px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#F0F0F0]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#555252]">Category Type</label>
            <select
              name="categoryType"
              value={categoryData.categoryType}
              onChange={handleInputChange}
              className="p-2 w-[200px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#F0F0F0]"
              required
            >
              <option value="Select Type" disabled>Select Type</option>
              <option value="Single Record">Single Record</option>
              <option value="Multiple Record">Multiple Record</option>
            </select>
          </div>
          {/* Workflow Dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-[#555252]">Select Workflow</label>
        <select
          name="workflow"
          className="p-2 w-[200px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#F0F0F0]"
          required
        >
          <option value="">Select Workflow</option>
          {/* Dynamically render workflows from API */}
          {workflows.map((workflow) => (
            <option key={workflow.id} value={workflow.workflowname}>
              {workflow.workflowname} {/* Adjust according to the structure of your API response */}
            </option>
          ))}
          {/* name="categoryType"
          value={categoryData.categoryType} */}
        </select>
      </div>
   {/* Approval Role Dropdown */}
   <div className="flex flex-col gap-2">
            <label className="text-[#555252]">Approvers Role</label>
            <select
              name="approvalRole"
              value={selectedApprovalRole}
              onChange={(e)=>handleApprovalRoleChange(e)}
              className="p-2 w-[200px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#F0F0F0]"
              required
            >
              <option value="" disabled> Approvers Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.role} 
                </option>
              ))}
            </select>
          </div>
       
          

          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-full bg-blue-600 text-white py-2 px-10 w-[150px] hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
         
        

    


       
    {/* Search Bar */}
    <div className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search"
        className=" w-[250px] p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
      


        {/* Category Table */}
        <div className="overflow-x-auto h-[584px]">
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="sticky top-0 bg-gray-200">
          <tr>
                <th className="p-3 text-left">S.No </th>
                <th className="p-3 text-left">Category </th>
                <th className="p-3 text-left">Category Type</th>
                <th className="p-3 text-left">Date </th>
                <th className="p-3 text-left">Workflow </th>
                <th className="p-3 text-left">Approvers Role </th>
                <th className="p-3 text-left">Creator Name</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="overflow-scroll">
              {categories.length > 0 ? (
                filteredCategories.map((category, index)  => (
                  <tr key={category.categoryId} className="border-t border-gray-200">
                    <td className="p-3">{index+1}</td>
                    <td className="p-3">{category.categoriesname}</td>
                    <td className="p-3">{category.description}</td>
                    <td className="p-3">{category?.createdAt ? formatDate(category?.createdAt) : ''}</td>
                    <td className="p-3">{category.workflowname}</td>
                    <td className="p-3">{category.approvalrole}</td>
                    <td className="p-3">{category.createdBy}</td>
                    <td className="p-3 flex space-x-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="text-blue-500 hover:underline"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(category.categoryId)}
                        className="text-red-500 hover:underline"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-3">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Category Modal */}
      {isEditCategoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-3/4 lg:w-1/3 xl:w-1/2"
          >
          
           
             <h2 className="text-lg font-semibold mb-4">Edit Form</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2 w-[35%]">
                  <label className="text-[#555252]">Category</label>
                  <input
                    type="text"
                    value={selectedCategoryName}
                    onChange={(e) => setSelectedCategoryName(e.target.value)}
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                    required
                  />
                </div>
                    {/* Role Dropdown */}
        <div className="flex flex-col gap-2 w-[35%]">
          <label className="text-[#555252]">Role</label>
          <select
            name="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role}
              </option>
            ))}
          </select>
        </div>

              
              </div>
           

              {/* Scrollable Field Section */}
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto border p-4 rounded-lg ">
          <label className="text-[#555252]">Form Fields</label>
          {existingFields.map((field, index) => (
            <div key={index} className="flex items-center gap-4 flex-wrap">
              <input
                type="text"
                name="fieldname"
                value={field.fieldname}
                onChange={(e) => handleExistingFieldChange(index, e)}
                placeholder="Field Name"
                className="p-2 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="assetDataType"
                value={field.assetDataType}
                onChange={(e) => handleExistingFieldChange(index, e)}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="String">String</option>
                <option value="Integer">Integer</option>
                <option value="Date">Date</option>
              </select>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isNullable"
                  checked={field.isNullable}
                  onChange={(e) => handleExistingFieldChange(index, e)}
                />{' '}
                Not Null
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isUnique"
                  checked={field.isUnique}
                  onChange={(e) => handleExistingFieldChange(index, e)}
                />{' '}
                Unique
              </label>
              {!["Asset Name", "Unit of Measure", "Upload", "Quantity"].includes(field.fieldname) &&
                <button
                  type="button"
                  onClick={() => removeExistingField(field.id)}
                  className="text-red-500 hover:underline"
                >
                  <FaTrash />
                </button>
              }
            </div>
          ))}
          {newFields.map((field, index) => (
            <div key={index} className="flex items-center gap-4 flex-wrap">
              <input
                type="text"
                required
                name="fieldname"
                value={field.fieldname}
                onChange={(e) => handleNewFieldChange(index, e)}
                placeholder="Field Name"
                className="p-2 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="assetDataType"
                value={field.assetDataType}
                onChange={(e) => handleNewFieldChange(index, e)}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="String">String</option>
                <option value="Integer">Integer</option>
                <option value="Date">Date</option>
              </select>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isNullable"
                  checked={field.isNullable}
                  onChange={(e) => handleNewFieldChange(index, e)}
                />{' '}
                Not Null
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isUnique"
                  checked={field.isUnique}
                  onChange={(e) => handleNewFieldChange(index, e)}
                />{' '}
                Unique
              </label>
              {!["Asset Name", "Unit of Measure", "Upload", "Quantity"].includes(field.fieldname) &&
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="text-red-500 hover:underline"
                >
                  <FaTrash />
                </button>
              }
              {console.log({ field })}
            </div>
          ))}
        </div>

        <div className="my-4 flex justify-between flex-wrap">
          <button
            type="button"
            onClick={addField}
            className="rounded-full bg-blue-600 text-white py-2 px-4 hover:bg-blue-700"
          >
            Add Field
          </button>

          <button
            type="button"
            onClick={handleTemporarySave}
            className="rounded-full bg-blue-600 text-white py-2 px-4 hover:bg-blue-700"
          >
            Save
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="ml-3 rounded-full bg-green-600 text-white py-2 px-4 hover:bg-green-700"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Temporary Save Modal */}
      {isTempModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Category Temporarily Saved!</h2>
            <button
              onClick={() => {setIsTempModalOpen(false); fetchCategoryFields()}}
              className="rounded-full bg-blue-600 text-white py-2 px-4 hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
