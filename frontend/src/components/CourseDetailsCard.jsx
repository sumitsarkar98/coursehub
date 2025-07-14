import React from "react";

const CourseDetailsCard = ({ heading, skills }) => {
  return (
    <div className="bg-white w-full sm:w-full min-w-full md:max-w-md p-6 sm:p-8 md:p-10 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
      <h3 className="text-blue-700 font-bold text-lg sm:text-xl md:text-2xl uppercase mb-4 text-center">
        {heading}
      </h3>
      <ul className="space-y-3 text-gray-800 font-medium">
        {skills.map((skill, index) => (
          <li
            key={index}
            className="flex items-center gap-3 text-base sm:text-lg"
          >
            <i className="fa-solid fa-circle-check text-green-500 text-lg"></i>
            <span>{skill}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseDetailsCard;
