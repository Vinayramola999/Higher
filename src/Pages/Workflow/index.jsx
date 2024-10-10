import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const WorkflowPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [formData, setFormData] = useState({
    workflow: '',
    user: '',
    role: '',
  });

  const availableWorkflows = ['Workflow 1', 'Workflow 2', 'Workflow 3']; // Example workflows
  const availableUsers = ['User 1', 'User 2', 'User 3']; // Example users
  const availableRoles = ['Admin', 'Editor', 'Viewer']; // Example roles

  const handleAddWorkflow = () => {
    setWorkflows([...workflows, { ...formData, timestamp: new Date().toLocaleString() }]);
    setFormData({ workflow: '', user: '', role: '' });
    setIsModalOpen(false);
  };

  const handleDeleteWorkflow = (index) => {
    const updatedWorkflows = workflows.filter((_, i) => i !== index);
    setWorkflows(updatedWorkflows);
  };

  return (
    <div className="p-4">
      {/* <h1 className="text-xl font-bold mb-4">Workflows</h1> */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-full bg-blue-600 text-white py-2 px-4 mb-4 hover:bg-blue-700"
      >
        + Add Workflow
      </button>

      {/* Workflow Table */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 border-b">Sr.no.</th>
            <th className="py-2 border-b">User</th>
            <th className="py-2 border-b">Role</th>
            <th className="py-2 border-b">Workflow</th>
            <th className="py-2 border-b">Time Stamp</th>
            <th className="py-2 border-b">Created by</th>
            <th className="py-2 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {workflows.map((workflow, index) => (
            <tr key={index}>
              <td className="py-2 border-b">{index + 1}</td>
              <td className="py-2 border-b">{workflow.user}</td>
              <td className="py-2 border-b">{workflow.role}</td>
              <td className="py-2 border-b">{workflow.workflow}</td>
              <td className="py-2 border-b">{workflow.timestamp}</td>
              <td className="py-2 border-b">username</td>
              <td className="py-2 border-b">
                <button onClick={() => handleDeleteWorkflow(index)}>
                  <FaTrash className="text-red-500 hover:underline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Workflow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg p-6 shadow-lg w-11/11 md:w-1/2">
            <h2 className="text-lg font-semibold mb-8">Add Workflow</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddWorkflow();
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-gray-700">Workflow</label>
                <select
                  value={formData.workflow}
                  onChange={(e) =>
                    setFormData({ ...formData, workflow: e.target.value })
                  }
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  required
                >
                  <option value="" disabled>
                    Select Workflow
                  </option>
                  {availableWorkflows.map((workflow, index) => (
                    <option key={index} value={workflow}>
                      {workflow}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">User</label>
                <select
                  value={formData.user}
                  onChange={(e) =>
                    setFormData({ ...formData, user: e.target.value })
                  }
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  required
                >
                  <option value="" disabled>
                    Select User
                  </option>
                  {availableUsers.map((user, index) => (
                    <option key={index} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  required
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {availableRoles.map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons in one row */}
              <div className="col-span-2 flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full bg-red-600 text-white py-2 px-4 hover:bg-red-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-green-600 text-white py-2 px-4 hover:bg-green-700"
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
