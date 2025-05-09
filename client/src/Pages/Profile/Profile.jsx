import React, { useState, useEffect } from "react";
import { Upload, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../AuthContex/AuthContex";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    about: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/v1/profile/getUserDetails", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const userData = response.data.data;
        const updatedFormData = {
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          contactNumber: userData.additionalDetails?.contactNumber || "",
          email: userData.email || "",
          gender: userData.additionalDetails?.gender || "",
          dateOfBirth: userData.additionalDetails?.dateOfBirth || "",
          about: userData.additionalDetails?.about || "",
        };
        setFormData(updatedFormData);
        setSelectedImage(userData.image || null);
        updateUser({
          ...userData,
          role: userData.accountType?.toLowerCase() || user?.role,
          additionalDetails: userData.additionalDetails || {},
        });
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        setError("Failed to fetch user details.");
        try {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser) {
            setFormData({
              firstName: storedUser.firstName || "",
              lastName: storedUser.lastName || "",
              contactNumber: storedUser.contactNumber || "",
              email: storedUser.email || "",
              gender: "",
              dateOfBirth: "",
              about: "",
            });
            setSelectedImage(storedUser.image || null);
          }
        } catch (localError) {
          console.error("Failed to parse user from localStorage:", localError);
        }
      }
    };

    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        contactNumber: user.additionalDetails?.contactNumber || "",
        email: user.email || "",
        gender: user.additionalDetails?.gender || "",
        dateOfBirth: user.additionalDetails?.dateOfBirth || "",
        about: user.additionalDetails?.about || "",
      });
      setSelectedImage(user.image || null);
    } else {
      fetchUserDetails();
    }
  }, [user, updateUser]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("profileImage", file);
        const response = await axios.put("http://localhost:3000/api/v1/profile/updateUserProfileImage", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        const updatedUser = response.data.data;
        setSelectedImage(updatedUser.image);
        updateUser({
          ...updatedUser,
          role: user?.role || updatedUser.accountType?.toLowerCase(),
          additionalDetails: updatedUser.additionalDetails || user?.additionalDetails || {},
        });
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile image updated successfully!");
      } catch (error) {
        setError(error.response?.data?.message || "Failed to update profile image.");
        toast.error(error.response?.data?.message || "Failed to update profile image.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) {
      setError("First Name and Email are required.");
      toast.error("First Name and Email are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const updatedProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.contactNumber,
        email: formData.email,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        about: formData.about,
      };
      const response = await axios.put("http://localhost:3000/api/v1/profile/updateProfile", updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const updatedUser = response.data.updatedUserDetails;
      const completeUser = {
        ...user,
        ...updatedUser,
        image: updatedUser.image || user?.image,
        role: user?.role || updatedUser.accountType?.toLowerCase(),
        additionalDetails: updatedUser.additionalDetails || user?.additionalDetails || {},
      };
      updateUser(completeUser);
      localStorage.setItem("user", JSON.stringify(completeUser));
      toast.success("Profile updated successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile.");
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:3000/api/v1/profile/deleteProfile", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      logout();
      toast.success("Account deleted successfully!");
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete account.");
      toast.error(error.response?.data?.message || "Failed to delete account.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  return (
    <div className="flex items-center justify-center mx-5 p-2 mt-5">
      <div className="rounded-2xl bg-white shadow-2xl w-full flex flex-col md:flex-row">
        <div className="bg-pink-50 w-full md:w-[300px] p-6 flex flex-col items-center text-center">
          <label htmlFor="profileImage" className="cursor-pointer relative">
            {selectedImage ? (
              <img
                className="w-36 h-36 rounded-full border-4 border-white object-cover"
                src={selectedImage}
                alt="Profile"
              />
            ) : (
              <div className="w-36 h-36 flex items-center justify-center rounded-full border-4 border-white bg-gray-200">
                <Upload size={40} className="text-gray-500" />
              </div>
            )}
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            disabled={loading}
          />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">{formData.firstName || "User"}</h2>
          <p className="text-gray-500">{formData.email || "No email provided"}</p>
        </div>
        <div className="w-full md:w-[1000px] p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-700 mb-2 block">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full p-3 border bg-gray-50 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-gray-700 mb-2 block">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full p-3 border bg-gray-50 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-gray-700 mb-2 block">Contact Number</label>
                <input
                  type="tel"
                  id="contactNumber"
                  className="w-full p-3 border bg-gray-50 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-gray-700 mb-2 block">Email ID</label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border bg-gray-50 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email id"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-gray-700 mb-2 block">Gender</label>
                <select
                  id="gender"
                  className="w-full p-3 border bg-gray-50 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-gray-700 mb-2 block">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  className="w-full p-3 border bg-gray-50 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-700 mb-2 block">About</label>
                <textarea
                  id="about"
                  className="w-full p-3 border bg-gray-50 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about yourself"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows="4"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 transition disabled:bg-orange-300"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 focus:ring-4 focus:ring-red-300 transition disabled:bg-red-300 flex items-center justify-center"
                disabled={loading}
              >
                <Trash2 size={20} className="mr-2" />
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-white/10 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-800">Are you sure you want to delete your account?</h3>
            <p className="text-gray-600 mt-2">This action cannot be undone.</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;