import React, { useState } from 'react';
import axios from "./services/api";

const ContactForm = () => {
   const [formData, setFormData] = useState({ name: '', email: '', message: '' });
   const [isLoading, setIsLoading] = useState(false);

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         await axios.post('/api/admin/user-contact', formData);
         alert('Message sent successfully!');
         setFormData({ name: '', email: '', message: '' });
      } catch (error) {
         console.error(error);
         alert('Error sending message.');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                  <input
                     type="text"
                     name="name"
                     placeholder="Your Name"
                     value={formData.name}
                     onChange={handleChange}
                     required
                     disabled={isLoading}
                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
               </div>
               <div>
                  <input
                     type="email"
                     name="email"
                     placeholder="Your Email"
                     value={formData.email}
                     onChange={handleChange}
                     required
                     disabled={isLoading}
                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
               </div>
               <div>
                  <textarea
                     name="message"
                     placeholder="Your Message"
                     value={formData.message}
                     onChange={handleChange}
                     required
                     disabled={isLoading}
                     rows="4"
                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  />
               </div>
               <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {isLoading ? (
                     <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                     </span>
                  ) : (
                     'Send Message'
                  )}
               </button>
            </form>
         </div>
      </div>
   );
};

export default ContactForm;