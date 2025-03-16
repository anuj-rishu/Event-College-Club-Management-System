import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";
import { Transition } from "@headlessui/react";
import { SpinnerCircular } from "spinners-react";
import axios from "../services/api";

const ALLOWED_DOMAINS = [
  "Web Dev",
  "Public Relations",
  "Sponsorship",
  "C&E",
  "Creatives",
  "Media",
];
const ALLOWED_ROLES = [
  "President",
  "Vice President",
  "Lead",
  "Associate",
  "Member",
];

const UpdateDetails = () => {
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [passwordOtp, setPasswordOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  // UI states
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isEmailChange, setIsEmailChange] = useState(false);
  const [domainName, setDomainName] = useState("");
  const [role, setRole] = useState("Member");
  const [domainLoading, setDomainLoading] = useState(false);

  // Loading states
  const [nameLoading, setNameLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Set auth token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    fetchUserDetails();
  }, []);

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get("/api/admin/profile");
      setUserDetails(response.data);
      setName(response.data.name || "");
      setNewEmail(response.data.email || "");
      setDomainName(response.data.domain?.name || "");
      setRole(response.data.domain?.role || "Member");
    } catch (error) {
      showMessage("Error fetching user details", "error");
    } finally {
      setInitialLoading(false);
    }
  };

  const updateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showMessage("Name cannot be empty", "error");
      return;
    }
    setNameLoading(true);
    try {
      const response = await axios.put("/api/admin/profile/update-name", {
        name,
      });
      showMessage(response.data.message, "success");
      setUserDetails((prev) => ({ ...prev, name }));
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error updating name",
        "error"
      );
    } finally {
      setNameLoading(false);
    }
  };

  const requestPasswordOtp = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await axios.post("/api/admin/profile/request-password-change");
      setOtpSent(true);
      showMessage("OTP sent to your email", "success");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error sending OTP",
        "error"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !passwordOtp) {
      showMessage("All fields are required", "error");
      return;
    }
    setPasswordLoading(true);
    try {
      const response = await axios.post("/api/admin/profile/change-password", {
        currentPassword,
        newPassword,
        otp: passwordOtp,
      });
      showMessage(response.data.message, "success");
      setOtpSent(false);
      setCurrentPassword("");
      setNewPassword("");
      setPasswordOtp("");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error changing password",
        "error"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const requestEmailChange = async (e) => {
    e.preventDefault();
    if (!newEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      showMessage("Please enter a valid email", "error");
      return;
    }
    setEmailLoading(true);
    try {
      await axios.post("/api/admin/profile/request-email-change", { newEmail });
      setIsEmailChange(true);
      showMessage("OTP sent to new email", "success");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error sending OTP",
        "error"
      );
    } finally {
      setEmailLoading(false);
    }
  };

  const confirmEmailChange = async (e) => {
    e.preventDefault();
    if (!emailOtp.trim()) {
      showMessage("OTP is required", "error");
      return;
    }
    setEmailLoading(true);
    try {
      const response = await axios.post("/api/admin/profile/change-email", {
        newEmail,
        otp: emailOtp,
      });
      showMessage(response.data.message, "success");
      setIsEmailChange(false);
      setUserDetails((prev) => ({ ...prev, email: newEmail }));
      setEmailOtp("");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error changing email",
        "error"
      );
    } finally {
      setEmailLoading(false);
    }
  };

  const updateDomain = async (e) => {
    e.preventDefault();
    setDomainLoading(true);
    try {
      const response = await axios.put("/api/admin/profile/update-domain", {
        domain: {
          name: domainName,
          role: role,
        },
      });
      showMessage(response.data.message, "success");
      setUserDetails((prev) => ({
        ...prev,
        domain: { name: domainName, role: role },
      }));
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error updating domain",
        "error"
      );
    } finally {
      setDomainLoading(false);
    }
  };
 
  
    if (initialLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <SpinnerCircular />
        </div>
      );
    }
  
    return (
      <div className="flex-1 bg-gray-100 p-4 md:p-6 mt-9 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-3xl">
            <div className="px-4 py-6 md:p-8 lg:p-10">
              {/* Profile Header */}
              <div className="flex flex-col items-center mb-6 md:mb-8">
                <div className="mb-4">
                  <Avatar
                    name={name || "User"}
                    size={window.innerWidth < 768 ? "80" : "100"}
                    round={true}
                    className="shadow-lg"
                  />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">
                  {name || "User Profile"}
                </h2>
                <p className="text-gray-600 text-center break-all">{newEmail}</p>
                {userDetails?.domain && (
                  <p className="text-gray-600 text-center">
                    {userDetails.domain.name} - {userDetails.domain.role}
                  </p>
                )}
              </div>
  
              {/* Message Notification */}
              <Transition
                show={!!message}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className={`mb-4 p-3 rounded-lg ${
                  messageType === "error" ? "bg-red-100 text-red-700" :
                  messageType === "success" ? "bg-green-100 text-green-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {message}
                </div>
              </Transition>
  
              <div className="space-y-6 md:space-y-8">
                {/* Update Name Form */}
                <form onSubmit={updateName} className="space-y-4">
                  <h3 className="text-lg font-medium">Update Name</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter new name"
                      className="flex-1 px-3 py-2 border rounded-lg"
                      required
                      disabled={nameLoading}
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
                      disabled={nameLoading}
                    >
                      {nameLoading && <SpinnerCircular size={20} />}
                      {nameLoading ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
  
            
  
                {/* Password Change Form */}
                <form onSubmit={otpSent ? changePassword : requestPasswordOtp} className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  {otpSent && (
                    <div className="space-y-3">
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current Password"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                        disabled={passwordLoading}
                      />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                        disabled={passwordLoading}
                      />
                      <input
                        type="text"
                        value={passwordOtp}
                        onChange={(e) => setPasswordOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                        disabled={passwordLoading}
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={passwordLoading}
                  >
                    {passwordLoading && <SpinnerCircular size={20} />}
                    {passwordLoading ? "Processing..." : otpSent ? "Change Password" : "Request OTP"}
                  </button>
                </form>
  
                {/* Email Change Form */}
                <form onSubmit={isEmailChange ? confirmEmailChange : requestEmailChange} className="space-y-4">
                  <h3 className="text-lg font-medium">Change Email</h3>
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter new email"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                      disabled={emailLoading}
                    />
                    {isEmailChange && (
                      <input
                        type="text"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                        disabled={emailLoading}
                      />
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={emailLoading}
                  >
                    {emailLoading && <SpinnerCircular size={20} />}
                    {emailLoading ? "Processing..." : isEmailChange ? "Confirm Email Change" : "Request Email Change"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default UpdateDetails;