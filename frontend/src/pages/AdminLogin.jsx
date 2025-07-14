import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { authContext } from "../context/authContext";

const Login = () => {
  const { setLogedin } = useContext(authContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const res = await axios.post(
        "http://localhost:3000/admin/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      setLogedin(true);
      navigate("/admindashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 py-24 md:py-36"
      style={{ backgroundColor: "var(--bg-dark-color)" }}
    >
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8">
        <h3
          className="text-3xl font-bold mb-6 text-center underline uppercase"
          style={{
            color: "var(--blue-deep)",
          }}
        >
          Admin Login
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm font-semibold"
              style={{
                fontFamily: "var(--paragraph-font)",
                color: "var(--blue-dark)",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
              style={{ fontFamily: "var(--body-font)" }}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 text-sm font-semibold"
              style={{
                fontFamily: "var(--paragraph-font)",
                color: "var(--blue-dark)",
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
              style={{ fontFamily: "var(--body-font)" }}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full explore-btn text-lg uppercase"
          >
            Login
          </button>
        </form>

        {/* Additional Links */}
        <p
          className="mt-4 text-sm text-center"
          style={{ fontFamily: "var(--paragraph-font)" }}
        >
          Don't have an account?
          <Link
            to="/signup"
            className="text-blue-700 font-semibold text-[0.8rem] ml-1"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
