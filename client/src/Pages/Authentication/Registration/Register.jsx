import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../../Axois/AxoisInstant";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First Name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must include one uppercase letter and one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.accountType) {
      newErrors.accountType = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill out all the fields correctly!");
      return;
    }

    setLoading(true);

    try {
      const signupData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        accountType: formData.accountType === "student" ? "Student" : "Instructor",
      };

      const response = await apiRequest.post("/signup", signupData);

      if (response.data?.success) {
        toast.success("Registration Successful! Please log in.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          accountType: "",
        });
        setErrors({});
        navigate("/login");
      } else {
        toast.error(response.data?.message || "Signup failed. Please try again.");
        setErrors({ form: response.data?.message || "Signup failed. Please try again." });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed. Please try again later.");
      setErrors({
        form: error?.response?.data?.message || "Registration failed. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <div className="flex flex-col md:flex-row gap-x-5 p-2 min-h-screen items-center justify-center bg-white">
      <div className="md:w-2/5 w-full p-5 md:mx-10">
        <div className="bg-pink-100 shadow-2xl rounded-2xl w-full max-w-[450px] mx-auto p-8 text-black">
          <h1 className="text-gray-800 mb-6 text-4xl font-bold font-serif text-center">Sign Up</h1>
          <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
            {/* First Name */}
            <div className="mb-4">
              <label htmlFor="firstName" className="block mb-2 text-sm font-semibold text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className={`w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label htmlFor="lastName" className="block mb-2 text-sm font-semibold text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className={`w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-semibold text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Role */}
            <div className="mb-4">
              <label htmlFor="accountType" className="block mb-2 text-sm font-semibold text-gray-700">Select Role</label>
              <select
                id="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-blue-500 ${errors.accountType ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="" disabled>-- Choose Role --</option>
                <option value="student">Student</option>
                <option value="teacher">Instructor</option>
              </select>
              {errors.accountType && <p className="text-red-500 text-xs mt-1">{errors.accountType}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-5">
              <button
                type="submit"
                disabled={loading}
                className={`text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg px-5 py-2.5 w-40 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Processing..." : "Sign Up"}
              </button>
            </div>

            {/* Form Error */}
            {errors.form && <p className="text-red-500 text-center text-sm mt-4">{errors.form}</p>}

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-700">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 font-semibold hover:text-blue-600">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex md:w-3/5 md:justify-center md:items-center">
        <img
          src="https://www.smartschoolmart.com/image/cache/catalog/educationwall/38-cr-800x800.jpg"
          alt="Register illustration"
          className="w-full md:w-auto -mt-44 max-w-[650px]"
        />
      </div>
    </div>
  );
};

export default Register;
