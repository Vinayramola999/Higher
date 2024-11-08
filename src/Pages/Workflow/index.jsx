import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa"; // Import FaEdit icon
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
    user_id: "", // Store user_id for the selected user
  });
  const [availableWorkflows, setAvailableWorkflows] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newWorkflow, setNewWorkflow] = useState("");
  const [editWorkflowId, setEditWorkflowId] = useState(null);
  const [updatedOn, setUpdatedOn] = useState(null);
  const [tempWorkflows, setTempWorkflows] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // To store user details

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await axios.get("http://higherindia.net:9898/workflow/get");
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
      const response = await axios.delete(`http://higherindia.net:9898/workflow/delete/${id}`);
      setWorkflows(workflows.filter((workflow) => workflow.id !== id));
      setUpdatedOn((prev) => prev + 1);
      alert("Workflow deleted successfully!");
    } catch (error) {
      console.error("Error deleting workflow:", error);
      alert("Error deleting workflow. Please try again.");
    }
  };

  const handleAddNewWorkflow = () => {
    if (newWorkflow.trim() === "") return;

    const newWorkflowEntry = {
      workflowname: newWorkflow,
      description: "",
      createdby: "admin",
      id: Math.random().toString(36).substr(2, 9), // Generate a random ID
    };

    setTempWorkflows((prev) => [...prev, newWorkflowEntry]);
    setNewWorkflow(""); // Reset the new workflow input
  };

  const handleAddWorkflow = async () => {
    // Form validation to check if all fields are filled
    if (!formData.workflowname || !formData.user_id || !formData.description) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://higherindia.net:9898/workflow/save", {
        workflowname: formData.workflowname,
        description: formData.description,
        createdby: formData.createdby,
        user_id: formData.user_id, // Send user_id for the selected user
      });

      const newWorkflowData = { ...formData, id: response.data.id };
      setWorkflows([...workflows, newWorkflowData]);
      setFormData({
        workflowname: "",
        user: "",
        description: "",
        createdby: "admin",
        user_id: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding workflow:", error);
    }
  };

  const filteredWorkflows = [...availableWorkflows, ...pendingWorkflows].filter((workflow) =>
    workflow.workflowname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    return formData.workflowname && formData.user_id && formData.description;
  };

  const handleEditWorkflow = (workflow) => {
    setEditWorkflowId(workflow.id);
    setFormData({
      workflowname: workflow.workflowname,
      description: workflow.description,
      user_id: workflow.user_id,
      createdby: workflow.createdby,
    });
    setSelectedUser(availableUsers.find(user => user.id === workflow.user_id));
    setIsModalOpen(true);
  };

  const openModalForNewWorkflow = () => {
    setFormData({
      workflowname: "",
      description: "",
      user_id: "",
      createdby: "admin",
    });
    setSelectedUser(null);
    setNewWorkflow(""); // Clear new workflow input
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={openModalForNewWorkflow} // Open modal for adding new workflow
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
            {filteredWorkflows.map((workflow, index) => {
              const user = availableUsers.find(user => user.id === workflow.user_id);
              const userName = user ? user.first_name : "N/A";

              return (
                <tr key={workflow.workflowid} className="hover:bg-gray-100 transition duration-200">
                  <td className="py-3 border-b text-center">{index + 1}</td>
                  <td className="py-3 border-b text-center">{userName}</td>
                  <td className="py-3 border-b text-center">{workflow.workflowname}</td>
                  <td className="py-3 border-b text-center">{workflow.description}</td>
                  <td className="py-3 border-b text-center">{workflow.createdby}</td>
                  <td className="py-3 border-b text-center">
                    <button onClick={() => handleEditWorkflow(workflow)}>
                      <FaEdit className="text-blue-500 hover:underline" />
                    </button>
                    <button onClick={() => handleDeleteWorkflow(workflow.workflowid)}>
                      <FaTrash className="text-red-500 hover:underline" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Workflow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
            <h2 className="text-xl font-semibold mb-7 text-center">Add/Edit Workflow</h2>
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
                    <div className="mt-2 ">
                      <input
                        type="text"
                        value={newWorkflow}
                        onChange={(e) => setNewWorkflow(e.target.value)}
                        placeholder="New Workflow Name"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200 "
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
                    value={formData.user_id}
                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200 mb-[300px]"
                    required
                  >
                    <option value="" disabled>Select User</option>
                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Display user details */}
              {selectedUser && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-semibold text-lg">User Details</h3>
                  <p><strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Phone:</strong> {selectedUser.phone_no}</p>
                  <p><strong>Employee ID:</strong> {selectedUser.emp_id}</p>
                </div>
              )}

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
