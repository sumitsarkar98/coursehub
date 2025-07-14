import React from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import courseimage from "../assets/courseimage.webp";

const OrderNow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course;

  function placeOrder() {
    axios
      .post(
        "http://localhost:3000/user/ordernow",
        { courseId: course.id },
        { withCredentials: true } 
      )
      .then((res) => {
        alert(res.data.message);
        navigate("/dashboard"); 
      })
      .catch((err) => {
        console.error("Order Error:", err);
        alert(
          err.response?.data?.error || "Something went wrong while ordering."
        );
      });
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">
          No course selected. Go back to{" "}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => navigate("/allcourses")}
          >
            courses
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-20 md:mt-[90px]">
      <h1 className="text-2xl font-bold text-blue-900 mb-4 text-center">
        Confirm Your Order
      </h1>
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <img
          src={courseimage}
          alt={course.title}
          className="w-full h-56 object-cover rounded-lg mb-4"
        />

        <h3 className="text-xl font-semibold">{course.title}</h3>
        <p className="text-gray-700 mt-2">{course.description}</p>

        <div className="mt-4 flex justify-between items-center text-lg font-medium text-gray-800">
          <span>Price:</span>
          <span>
            ₹{course.price}{" "}
            <span className="line-through text-gray-500 ml-2">₹1000</span>
          </span>
        </div>

        <button
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={placeOrder}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default OrderNow;
