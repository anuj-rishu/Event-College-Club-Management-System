import React, { useEffect, useState } from 'react';
import axios from "../services/api";

const Interview = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({ domain: '', yearOfStudy: '', rating: '' });
  const [emailContent, setEmailContent] = useState({ subject: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/admin/requirment/getAllUsers');
        setUsers(response.data);
        setFilteredUsers(response.data); // Display all users initially
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle filtering
  const handleFilter = () => {
    const { domain, yearOfStudy, rating } = filters;

    const filtered = users.filter((user) => {
      return (
        (domain ? user.domain === domain : true) &&
        (yearOfStudy ? user.yearOfStudy === yearOfStudy : true) &&
        (rating ? user.rating >= parseInt(rating) : true)
      );
    });

    setFilteredUsers(filtered);
  };

  // Handle rating update
  const handleRatingUpdate = async (userId, rating) => {
    try {
      const response = await axios.put(`/api/admin/requirment/rateUser/${userId}`, { rating });
      const updatedUser = response.data.user;

      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, ...updatedUser } : user))
      );
      setFilteredUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, ...updatedUser } : user))
      );
      alert('Rating updated successfully!');
    } catch (err) {
      alert('Failed to update rating. Please try again.');
    }
  };

  // Handle sending emails to filtered users
  const handleSendEmails = async () => {
    try {
      await axios.post('/api/admin/requirment/sendBulkEmails', {
        filteredUsers,
        subject: emailContent.subject,
        text: emailContent.text,
      });
      alert('Emails sent successfully!');
    } catch (err) {
      alert('Failed to send emails. Please try again.');
    }
  };

  const handleClearRating = async (userId) => {
    try {
      const response = await axios.put(`/api/admin/requirment/rateUser/${userId}`, { 
        rating: null,
        status: 'Remaining'
      });
      const updatedUser = response.data.user;
  
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, rating: null, status: 'Remaining' } : user))
      );
      setFilteredUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, rating: null, status: 'Remaining' } : user))
      );
      alert('Rating cleared successfully!');
    } catch (err) {
      alert('Failed to clear rating. Please try again.');
    }
  };


  
    return (
      <div className="container mx-auto px-4 py-8">
     
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Students Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <h3 className="text-xl font-semibold p-4 bg-gray-50">All Students</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.whatsappPhoneNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.yearOfStudy}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.domain}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.rating || 'No Rating'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'Selected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status || 'Remaining'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
  <div className="flex space-x-2 items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        onClick={() => handleRatingUpdate(user._id, star)}
        className="p-1 hover:bg-gray-100 rounded"
      >
        {star}⭐
      </button>
    ))}
    <button
      onClick={() => handleClearRating(user._id)}
      className="ml-2 px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
    >
      Clear
    </button>
  </div>
</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
  
            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Filter Students</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Domain</label>
                  <select 
                    onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Public Relations">Public Relations</option>
                    <option value="Sponsorship">Sponsorship</option>
                    <option value="Content and Editorial">Content and Editorial</option>
                    <option value="Creatives">Creatives</option>
                    <option value="Media">Media</option>
                  </select>
                </div>
  
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Year of Study</label>
                  <select 
                    onChange={(e) => setFilters({ ...filters, yearOfStudy: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                  </select>
                </div>
  
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <select 
                    onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="1">1 Star or more</option>
                    <option value="2">2 Stars or more</option>
                    <option value="3">3 Stars or more</option>
                    <option value="4">4 Stars or more</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={handleFilter}
                className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
  
            {/* Email Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Send Emails</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Subject</label>
                  <input
                    type="text"
                    value={emailContent.subject}
                    onChange={(e) => setEmailContent({ ...emailContent, subject: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Text</label>
                  <textarea
                    value={emailContent.text}
                    onChange={(e) => setEmailContent({ ...emailContent, text: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button 
                  onClick={handleSendEmails}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Send Emails
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Interview;