import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../services/api";

const FormBuilder = ({ editMode = false }) => {
  const [fields, setFields] = useState([]);
  const [formName, setFormName] = useState("");
  const [formLink, setFormLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (editMode && id) {
      fetchForm();
    }
  }, [editMode, id]);

   const fetchForm = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`/api/admin/forms/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setFormName(data.name);
        setFields(data.fields);
      } catch (error) {
        if (error.response?.status === 401) {
          setError("Unauthorized - Please login again");
          // Optionally redirect to login page
          // navigate('/login');
        } else {
          setError("Failed to load form");
        }
      } finally {
        setIsLoading(false);
      }
  };

  const addField = (type) => {
    setFields([...fields, { type, label: "", options: [], rawOptions: "" }]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index, key, value) => {
    const updatedFields = [...fields];
    if (key === "options") {
      updatedFields[index].rawOptions = value;
      updatedFields[index].options = value
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt);
    } else {
      updatedFields[index][key] = value;
    }
    setFields(updatedFields);
  };

  const validateForm = () => {
    if (!formName.trim()) {
      setError("Form name is required");
      return false;
    }
    if (!fields.length) {
      setError("Add at least one field");
      return false;
    }
    for (const field of fields) {
      if (!field.label.trim()) {
        setError("All fields must have labels");
        return false;
      }
      if (
        (field.type === "radio" || field.type === "checkbox") &&
        !field.options.length
      ) {
        setError("Radio/Checkbox fields must have options");
        return false;
      }
    }
    return true;
  };

  const saveForm = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    try {
           if (editMode) {
        const token = localStorage.getItem('token');
        await axios.put(`/api/admin/forms/${id}`, 
          { name: formName, fields },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        navigate("/");
      } else {
                const token = localStorage.getItem('token');
        const { data } = await axios.post("/api/admin/forms", 
          {
            name: formName,
            fields,
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setFormLink(data.link);
      }
    } catch (error) {
      setError("Failed to save form");
    } finally {
      setIsLoading(false);
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
    <div className="max-w-4xl mx-auto p-6">
      <nav className="mb-8">
        <Link
          to="/formlist"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Forms
        </Link>
      </nav>

      <h1 className="text-3xl font-bold mb-6">
        {editMode ? "Edit Form" : "Create New Form"}
      </h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Name
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter form name"
          />
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex gap-4 mb-2">
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(index, "label", e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="Field label"
                />
                <button
                  onClick={() => removeField(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>

              {(field.type === "radio" || field.type === "checkbox") && (
                <input
                  type="text"
                  value={field.rawOptions}
                  onChange={(e) =>
                    updateField(index, "options", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg mt-2"
                  placeholder="Options (comma-separated)"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => addField("text")}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Add Text Field
          </button>
          <button
            onClick={() => addField("radio")}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Add Radio Group
          </button>
          <button
            onClick={() => addField("checkbox")}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Add Checkbox Group
          </button>
        </div>

        <button
          onClick={saveForm}
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {editMode ? "Update Form" : "Save Form"}
        </button>

        {formLink && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-2">Form Link:</h3>
            <a
              href={formLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 break-all"
            >
              {formLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;