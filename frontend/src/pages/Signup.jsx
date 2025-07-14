import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    gender: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3000/user/register", {
        fullname: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        gender: formData.gender,
      });

      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <section
      className="min-h-screen flex items-start justify-center px-4 py-24 md:py-36"
      style={{ backgroundColor: "var(--bg-dark-color)" }}
    >
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8 mt-5">
        <h2
          className="text-3xl font-bold mb-6 text-center uppercase"
          style={{
            fontFamily: "var(--heading-font)",
            color: "var(--blue-deep)",
          }}
        >
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 text-sm font-semibold">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="border border-gray-300 rounded-md px-4 py-2"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm font-semibold">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-md px-4 py-2"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label htmlFor="role" className="mb-1 text-sm font-semibold">
              Role
            </label>
            <select
              id="role"
              className="border border-gray-300 rounded-md px-4 py-2"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label htmlFor="gender" className="mb-1 text-sm font-semibold">
              Gender
            </label>
            <select
              id="gender"
              className="border border-gray-300 rounded-md px-4 py-2"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              className="border border-gray-300 rounded-md px-4 py-2"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="mb-1 text-sm font-semibold"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="border border-gray-300 rounded-md px-4 py-2"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md uppercase hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>

        {/* Redirect to login */}
        <p className="mt-4 text-sm text-center">
          Already have an account?
          <Link to="/login" className="text-blue-700 font-semibold ml-1">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Signup;
