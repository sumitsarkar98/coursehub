import React, { useContext } from "react";
import courseimage from "../assets/courseimage.webp";
import { authContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const CourseShowcase = ({ course }) => {
  const navigate = useNavigate();
  const { isLogedin } = useContext(authContext);

  function handleEnroll() {
    if (isLogedin) {
      navigate("/order", { state: { course } });
    } else {
      navigate("/login");
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 max-w-xs w-full mx-auto flex flex-col justify-between">
      <img
        src={course.image || courseimage}
        alt={course.title}
        className="w-full h-40 object-cover"
      />

      <div className="p-2 md:p-4 flex flex-col justify-between h-full flex-1">
        <div>
          <h3 className="w-full text-center font-semibold text-blue-900 text-lg">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 px-1 line-clamp-3">
            {course.description}
          </p>

          <div className="w-full mt-4 flex items-center justify-between text-yellow-500 text-sm gap-1 px-1 flex-wrap">
            <div>
              <span>Rating :</span>
              {Number.isInteger(course.rating) && course.rating > 0 ? (
                [...Array(course.rating)].map((_, i) => <span key={i}>★</span>)
              ) : (
                <span className="text-gray-500 ml-1">Not available</span>
              )}
            </div>

            <div className="text-gray-900 font-semibold px-2 flex">
              ₹ {course.price}/-
              <span className="line-through text-gray-500 ml-2">₹ 1000</span>
            </div>
          </div>
        </div>

        <button
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          onClick={handleEnroll}
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
};

export default CourseShowcase;
