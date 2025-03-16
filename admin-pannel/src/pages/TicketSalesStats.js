import { useState, useEffect } from 'react';
import axios from "../services/api";
import { FiLoader } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

export default function TicketStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await axios.get('/api/admin/ticket/stats', {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true
        });
        setStats(response.data);
       
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error fetching stats';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <Toaster position="top-right" />
        
        <div className="p-4 md:p-8 mt-14 md:mt-0">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Ticket Generation Statistics</h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md text-red-800">
                  {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="text-gray-600 mb-2">Admin Name</div>
                    <div className="font-medium text-gray-800 text-lg">{stats?.adminName}</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="text-gray-600 mb-2">Total Tickets Generated</div>
                    <div className="font-bold text-indigo-600 text-3xl">
                      {stats?.ticketsGenerated || 0}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}