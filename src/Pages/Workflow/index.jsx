import React, { useState, useEffect } from "react";
import { FaTrash, FaSearch } from "react-icons/fa";
import axios from "axios";

const WorkflowPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workflows, setWorkflows] = useState([]); // Main table data
  const [pendingWorkflows, setPendingWorkflows] = useState([]); // Workflows to be added
  const [formData, setFormData] = useState({
    workflowname: "",
    user: "",
    description: "",
    createdby: "admin",
  });
  const [availableWorkflows, setAvailableWorkflows] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newWorkflow, setNewWorkflow] = useState("");
  const [editWorkflowId, setEditWorkflowId] = useState(null);
  const [updatedOn, setUpdatedOn] =  useState(null);
  const [tempWorkflows, setTempWorkflows] = useState([])


  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await axios.get("http://higher.co.in:9898/workflow/get");
        setAvailableWorkflows(response.data);
        setWorkflows(response.data); // Ensure ID is included
      } catch (error) {
        console.error("Error fetching workflows:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://43.204.140.118:3001/users/getusers");
        setAvailableUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchWorkflows();
    fetchUsers();
  }, [updatedOn]);
  

  const handleDeleteWorkflow = async (id) => {
    if (!id) {
      console.error("Invalid workflow ID:", id);
      return;
    }
  
    try {
      console.log("Attempting to delete workflow with ID:", id);
      const response = await axios.delete(`http://higher.co.in:9898/workflow/delete/${id}`);
      setWorkflows(workflows.filter((workflow) => workflow.id !== id));
       setUpdatedOn((prev) => prev + 1);
      
      console.log("API Response:", response); // Log the response
  
      if (response.status === 200) {
        const updatedWorkflows = workflows.filter((workflow) => workflow.id !== id);
        setWorkflows(updatedWorkflows);
        alert("Workflow deleted successfully!");
      } else {
        console.error("Failed to delete workflow:", response);
        alert("Failed to delete workflow. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting workflow:", error);
      alert("Error deleting workflow. Please try again.");
    }
  }
  
  const handleAddNewWorkflow = () => {
    if (newWorkflow.trim() === "") return;

    const newWorkflowEntry = {
      workflowname: newWorkflow,
      description: "",
      createdby: "admin",
      id: Math.random().toString(36).substr(2, 9), // Generate a random ID
    };

    // Store the new workflow in pending workflows
    // setPendingWorkflows([...pendingWorkflows, newWorkflowEntry]);
    setTempWorkflows(prev => ([...prev, newWorkflowEntry]))
    // setAvailableWorkflows([...availableWorkflows, newWorkflowEntry]); // Add to dropdown options
    setNewWorkflow(""); // Reset the new workflow input
  };

  const handleAddWorkflow = async () => {
    try {
      const response = await axios.post("http://higher.co.in:9898/workflow/save", {
        workflowname: formData.workflowname,
        description: formData.description,
        createdby: formData.createdby,
      });

      const newWorkflowData = { ...formData, id: response.data.id };
      setWorkflows([...workflows, newWorkflowData]);
      setFormData({ workflowname: "", user: "", description: "", createdby: "admin" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding workflow:", error);
    }
  };

  const filteredWorkflows = [...availableWorkflows, ...pendingWorkflows].filter((workflow) =>
    workflow.workflowname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    return formData.workflowname && formData.user && formData.description;
  };

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-blue-600 text-white py-3 px-6 hover:bg-blue-700 transition duration-300"
        >
          + Add Workflow
        </button>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="text-gray-500 ml-2" />
        </div>
      </div>
      

      {/* Workflow Table */}
      
      <div className="overflow-auto mb-4" style={{ maxHeight: "690px" }}>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mx-auto">
          <thead className="bg-gray-300 sticky top-0">
            <tr>
              <th className="py-3 border-b text-center px-4">Sr.no.</th>
              <th className="py-3 border-b text-center px-4">User</th>
              <th className="py-3 border-b text-center px-4">Workflow</th>
              <th className="py-3 border-b text-center px-4">Description</th>
              <th className="py-3 border-b text-center px-4">Created by</th>
              <th className="py-3 border-b text-center px-4">Action</th>
            </tr>
          </thead>
          <tbody>
          {filteredWorkflows.map((workflow, index) => (
              <tr key={workflow.workflowid} className="hover:bg-gray-100 transition duration-200">
                <td className="py-3 border-b text-center">{index + 1}</td>
                <td className="py-3 border-b text-center">{workflow.user || "N/A"}</td>
                <td className="py-3 border-b text-center">{workflow.workflowname}</td>
                <td className="py-3 border-b text-center">{workflow.description}</td>
                <td className="py-3 border-b text-center">{workflow.createdby}</td>
                <td className="py-3 border-b text-center">
                  <button onClick={() => handleDeleteWorkflow(workflow.workflowid)}>
                    <FaTrash className="text-red-500 hover:underline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Workflow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
            <h2 className="text-xl font-semibold mb-7 text-center">Add Workflow</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (validateForm()) {
                  handleAddWorkflow();
                } else {
                  alert("Please fill in all fields.");
                }
              }}
              className="grid grid-cols-1 gap-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1">Workflow</label>
                  <select
                    value={formData.workflowname}
                    onChange={(e) => setFormData({ ...formData, workflowname: e.target.value })}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
                    required
                  >
                    <option value="" disabled>Select Workflow</option>
                    {filteredWorkflows.map((workflow) => (
                      <option key={workflow.id} value={workflow.workflowname}>
                        {workflow.workflowname}
                      </option>
                    ))}

                    {tempWorkflows?.map((workflow) => (
                      <option key={workflow.id} value={workflow.workflowname}>
                        {workflow.workflowname}
                      </option>
                    ))}

                    <option value="add-new">Add New Workflow</option>
                  </select>
                  {formData.workflowname === "add-new" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={newWorkflow}
                        onChange={(e) => setNewWorkflow(e.target.value)}
                        placeholder="New Workflow Name"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewWorkflow}
                        className="mt-2 rounded bg-blue-500 text-white py-1 px-4 hover:bg-blue-600"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">User</label>
                  <select
                    value={formData.user}
                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200 mb-[300px]"
                    required
                  >
                    <option value="" disabled>Select User</option>
                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.first_name}>
                        {user.first_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded bg-red-600 text-white py-2 px-3 hover:bg-red-700 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-green-600 text-white py-2 px-3 hover:bg-green-700 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowPage;
