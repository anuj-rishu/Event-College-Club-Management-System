import React, { useEffect, useState } from 'react';
import axios from "../services/api";

const MessageSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
      <div>
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div>
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
    <div className="mb-4">
      <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div className="flex justify-between items-center">
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
);

const AdminPanel = () => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/admin/contact/user-messages', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMessages(data);
      } catch (error) {
        console.error(error);
        alert('Error fetching messages');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleReply = async () => {
    if (!selectedMessageId || !reply) {
      alert('Please select a message and write a reply.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/contact/user-messages/reply',
        {
          id: selectedMessageId,
          replyMessage: reply,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === selectedMessageId ? { ...msg, isReplied: true } : msg
        )
      );
      setReply('');
      setSelectedMessageId(null);
    } catch (error) {
      console.error(error);
      alert('Error sending reply.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`api/admin/contact/user-messages/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error(error);
      alert('Error deleting message.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 bg-white z-10 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Panel</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <MessageSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-lg border"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Name</p>
                    <p className="font-medium text-sm">{msg.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="font-medium text-sm break-all">{msg.email}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-600">Message</p>
                  <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{msg.message}</p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${msg.isReplied ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    `}>
                      {msg.isReplied ? 'Replied' : 'New'}
                    </span>

                    {msg.isReplied && (
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {!msg.isReplied && (
                    <div className="space-y-3">
                      <textarea
                        placeholder="Write your reply here..."
                        value={selectedMessageId === msg._id ? reply : ''}
                        onChange={(e) => {
                          setSelectedMessageId(msg._id);
                          setReply(e.target.value);
                        }}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                        rows="3"
                        disabled={isSubmitting}
                      />
                      <button
                        onClick={handleReply}
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;