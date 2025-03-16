import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/api";

const FormPreview = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const { data } = await axios.get(`/api/admin/forms/${id}`);
        setForm(data);
      } catch (error) {
        console.error("Error fetching form:", error);
      }
    };

    fetchForm();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/admin/forms/${id}/responses`, response);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  if (!form) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  if (form.status === "paused") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 p-8 rounded-lg shadow-lg">
          <p className="text-yellow-700 text-lg">This form is currently paused and not accepting responses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">{form.name}</h1>
        
        {submitted ? (
          <div className="text-center p-8 bg-green-50 rounded-lg">
            <p className="text-green-700 text-lg font-medium">Thank you for your response!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map((field, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                
                {field.type === "text" && (
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    onChange={(e) =>
                      setResponse({ ...response, [field.label]: e.target.value })
                    }
                  />
                )}
                
                {(field.type === "radio" || field.type === "checkbox") && (
                  <div className="space-y-2">
                    {field.options.map((option, i) => (
                      <div key={i} className="flex items-center">
                        <input
                          type={field.type}
                          name={field.label}
                          value={option}
                          className={`
                            ${field.type === 'radio' ? 'form-radio' : 'form-checkbox'}
                            h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300
                          `}
                          onChange={(e) =>
                            setResponse({ ...response, [field.label]: e.target.value })
                          }
                        />
                        <label className="ml-3 text-sm text-gray-600">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FormPreview;