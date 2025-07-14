import React from "react";
import personImage from "../assets/personImage.png";
import studentImage2 from "../assets/studentImage2.png";
import studentImage3 from "../assets/studentImage3.png";

const StudentCard = ({ data }) => {
  if (!data) return null;
  const {
    candidate_name,
    hired_by,
    package: salary,
    review,
    job_location,
    job_roll,
    status,
  } = data;
  return (
    <div
      id="studentCard"
      className="max-w-[450px] border-2 border-blue-900 rounded-lg shadow-lg p-8 flex flex-col items-center"
    >
      <img
        src={studentImage3}
        alt="Student profile"
        className="w-30 h-30  object-contain mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{candidate_name}</h3>
      <ul className="text-center space-y-1">
        <li className=" text-xl">Hired by: {hired_by}</li>
        <li className=" text-xl">Role: {job_roll}</li>
        <li className=" text-xl">Package: ₹{salary} LPA</li>
      </ul>
    </div>
  );
};

export default StudentCard;
