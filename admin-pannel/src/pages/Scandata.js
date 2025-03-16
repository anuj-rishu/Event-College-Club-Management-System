import React, { useState, useEffect } from "react";
import axios from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

const ScanData = () => {
  const [data, setData] = useState([]);
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
      const response = await axios.get("/api/admin/event/user-scan-data", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setData(response.data);
    } catch (error) {
      setError("Failed to fetch scan data");
      toast.error("Failed to fetch scan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <Toaster position="top-right" />
        
        <div className="p-4 md:p-8 mt-14 md:mt-0">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-4 mb-4">
            <p className="text-gray-600">Total Scans: {data.length}</p>
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
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scanned At</th>
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
                                <div className="text-sm text-gray-900">{item.name}</div>
                                <div className="md:hidden text-xs text-gray-500 mt-1">{item.email}</div>
                              </td>
                              <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{item.email}</div>
                              </td>
                              <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {new Date(item.scannedAt).toLocaleString()}
                                </div>
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

export default ScanData;