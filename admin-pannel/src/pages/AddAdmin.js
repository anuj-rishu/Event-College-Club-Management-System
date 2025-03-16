import React, { useEffect, useState } from "react";
import axios from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

const AddAdmin = () => {
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    domain: "",
    role: "",
  });
  
  const [editData, setEditData] = useState({
    domain: "",
    role: "",
  });

  
  const ALLOWED_DOMAINS = ["Web Dev", "Public Relations", "Sponsorship", "C&E", "Creatives", "Media"];
  const ALLOWED_ROLES = ["President", "Vice President", "Lead", "Associate", "Member"];

  // Fetch all members
  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token'); // Get stored token
      
      const res = await axios.get("/api/admin/get-all-member", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setMembers(res.data);
    } catch (err) {
      toast.error("Failed to fetch members");
    }
};

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle add member
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      await axios.post("/api/admin/add-new-member", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success("Member added successfully");
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add member");
    }
};

  // Handle delete member
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`api/admin/delete-member/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success("Member deleted successfully");
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete member");
    }
};

  // Handle update member
  const handleEdit = (member) => {
    setEditingId(member._id);
    setEditData({
      domain: member.domain.name,
      role: member.domain.role,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `api/admin/update-user/${id}`,
        editData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success("Member updated successfully");
      setEditingId(null);
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update member");
    }
  };


  return (
  
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <Toaster position="top-right" />

        {/* Add Member Form */}
        <div className="max-w-4xl mx-auto  mt-14 md:mt-0 bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Add New Member</h2>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Domain</label>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Domain</option>
                {ALLOWED_DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Role</option>
                {ALLOWED_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Add Member
            </button>
          </form>
        </div>


                {/* Member List */}
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-6">Member List</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Domain</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {members.map((member) => (
                          <tr key={member._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingId === member._id ? (
                                <select
                                  value={editData.domain}
                                  onChange={(e) => setEditData({...editData, domain: e.target.value})}
                                  className="w-full p-2 border rounded"
                                >
                                  {ALLOWED_DOMAINS.map(domain => (
                                    <option key={domain} value={domain}>{domain}</option>
                                  ))}
                                </select>
                              ) : (
                                member.domain.name
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingId === member._id ? (
                                <select
                                  value={editData.role}
                                  onChange={(e) => setEditData({...editData, role: e.target.value})}
                                  className="w-full p-2 border rounded"
                                >
                                  {ALLOWED_ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                  ))}
                                </select>
                              ) : (
                                member.domain.role
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingId === member._id ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleUpdate(member._id)}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <FiCheck className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <FiX className="h-5 w-5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEdit(member)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <FiEdit2 className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(member._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <FiTrash2 className="h-5 w-5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          
        );
      };
      
      export default AddAdmin;