import axios from "axios";

const API_URL = "http://localhost:9000";

export const submitForm = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/submitForm`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "An error occurred";
  }
};
// export
module.exports = {
  submitForm,
};
