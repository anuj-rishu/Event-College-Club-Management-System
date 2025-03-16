import React, { useEffect, useState } from "react";
import axios from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const FormList = () => {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
        const fetchForms = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const { data } = await axios.get("/api/admin/forms", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setForms(data);
      } catch (error) {
        if (error.response?.status === 401) {
          setError("Unauthorized - Please login again");
          // Optionally redirect to login
          // navigate('/login');
        } else {
          setError("Failed to fetch forms");
        }
        console.error("Error fetching forms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, []);

    const deleteForm = async (id) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/forms/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setForms(forms.filter((form) => form._id !== id));
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Unauthorized - Please login again");
      } else {
        setError("Failed to delete form");
      }
      console.error("Error deleting form:", error);
    }
  };
  const editForm = (id) => {
    navigate(`/edit/${id}`);
  };

    const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `/api/admin/forms/${id}/status`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setForms(forms.map((form) => (form._id === id ? data : form)));
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Unauthorized - Please login again");
      } else {
        setError("Failed to update form status");
      }
      console.error("Error toggling form status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Forms</h1>
        <Link
          to="/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Form
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          {error}
        </div>
      )}

      {forms.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <div
              key={form._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{form.name}</h2>
                <span className={`px-2 py-1 text-sm rounded-full ${
                  form.status === "active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {form.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex space-x-3">
                  <Link
                    to={`/form/${form._id}`}
                    target="_blank"
                    className="flex-1 px-3 py-2 text-center text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                  >
                    View Form
                  </Link>
                  <Link
                    to={`/responses/${form._id}`}
                    target="_blank"
                    className="flex-1 px-3 py-2 text-center text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                  >
                    Responses
                  </Link>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => editForm(form._id)}
                    className="flex-1 px-3 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteForm(form._id)}
                    className="flex-1 px-3 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <button
                  onClick={() => toggleStatus(form._id, form.status)}
                  className={`w-full px-3 py-2 rounded transition-colors ${
                    form.status === "active"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {form.status === "active" ? "Pause" : "Start"} Responses
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No forms created yet.</p>
          <Link
            to="/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Form
          </Link>
        </div>
      )}
    </div>
  );
};

export default FormList;