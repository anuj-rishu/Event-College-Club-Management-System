import React, { useState, useEffect } from "react";
import axios from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { FiEdit2, FiTrash2, FiMenu ,  FiCheck, FiX, FiLoader } from "react-icons/fi";

const UserDisplay = () => {
  const [data, setData] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get("/api/admin/event/user-register-data", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setData(response.data);
    } catch (error) {
      setError("Failed to fetch user data");
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/event/user-register-data/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  const handleEdit = (item) => {
    setEditingData(item);
    setEditName(item.name);
    setEditEmail(item.email);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/admin/event/user-register-data/${editingData._id}`,
        { name: editName, email: editEmail },
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      fetchData();
      setEditingData(null);
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Error updating user");
    }
  };

    return (
      <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <Toaster position="top-right" />
        
        <div className="p-4 md:p-8 mt-14 md:mt-0">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-4 mb-4">
            <p className="text-gray-600">Total Users: {data.length}</p>
          </div>
  
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
  
              {loading ? (
                <div className="flex justify-center py-8">
                  <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                </div>
              ) : error ? (
                <div className="text-red-600 p-4 text-center">{error}</div>
              ) : (
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Register Date</th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {data
                            .filter(item => 
                              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.email.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((item) => (
                              <tr key={item._id} className="hover:bg-gray-50">
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                  {editingData && editingData._id === item._id ? (
                                    <input
                                      type="text"
                                      value={editName}
                                      onChange={(e) => setEditName(e.target.value)}
                                      className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-500"
                                    />
                                  ) : (
                                    <div className="text-sm text-gray-900">{item.name}</div>
                                  )}
                                  {/* Mobile-only email display */}
                                  <div className="md:hidden text-xs text-gray-500 mt-1">{item.email}</div>
                                </td>
                                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                  {editingData && editingData._id === item._id ? (
                                    <input
                                      type="email"
                                      value={editEmail}
                                      onChange={(e) => setEditEmail(e.target.value)}
                                      className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-500"
                                    />
                                  ) : (
                                    <div className="text-sm text-gray-900">{item.email}</div>
                                  )}
                                </td>
                                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {new Date(item.registerAt).toLocaleString()}
                                  </div>
                                </td>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm">
                                  {editingData && editingData._id === item._id ? (
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={handleUpdate}
                                        className="p-1 text-green-600 hover:text-green-900"
                                      >
                                        <FiCheck className="h-5 w-5" />
                                      </button>
                                      <button
                                        onClick={() => setEditingData(null)}
                                        className="p-1 text-red-600 hover:text-red-900"
                                      >
                                        <FiX className="h-5 w-5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleEdit(item)}
                                        className="p-1 text-indigo-600 hover:text-indigo-900"
                                      >
                                        <FiEdit2 className="h-5 w-5" />
                                      </button>
                                      <button
                                        onClick={() => handleDelete(item._id)}
                                        className="p-1 text-red-600 hover:text-red-900"
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
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

export default UserDisplay;