import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import StudentCard from "../components/JobCandidates.jsx";
import teacherImg from "../assets/teacherImg.png";
import CourseDetailsCard from "../components/CourseDetailsCard.jsx";

const Sigma = () => {
  const [jobCandidates, setJobCandidates] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const jobCandidateDetails = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/user/hiredStudents",
          {
            withCredentials: true,
          }
        );
        setJobCandidates(res.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to fetch user profile."
        );
      }
    };

    jobCandidateDetails();
  }, []);
  return (
    <div>
      {/* SECTION 1: Hero Section */}
      <section
        id="sigma-one"
        className="h-screen bg-[#e9f2fd] px-2 lg:px-20 py-24 md:pt-36 md:pb-10 xl:flex flex-col-reverse md:flex-row justify-center items-center"
      >
        {/* Left Text Content */}
        <div className="w-full md:w-2/3 flex flex-col justify-center items-center text-center gap-4">
          {/* h1 aligned right */}
          <h1 className="text-2xl xl:text-4xl text-center mb-5 text-black mt-5">
            Sigma 8.0 :
          </h1>
          <h1 className="text-3xl xl:text-6xl text-center mb-3">
            Complete-Placement
          </h1>
          <h1 className="text-3xl xl:text-6xl text-center">Preparation !</h1>
          {/* ul centered */}
          <ul className="w-full xl:w-2/3 p-2 space-y-2 text-gray-800 font-medium mt-4 flex justify-center flex-col items-start xl:items-center">
            <li className="flex items-center justify-center gap-3 text-base sm:text-lg md:text-xl">
              <i className="fa-solid fa-video text-blue-700"></i>
              Development + DSA + Aptitude
            </li>
            <li className="flex items-center justify-center gap-3 text-base sm:text-lg md:text-xl">
              <i className="fa-solid fa-users-line text-blue-700 text-start "></i>
              Individual Doubt Clearing sessions
            </li>
            <li className="flex items-center justify-center gap-3 text-base sm:text-lg md:text-xl">
              <i className="fa-solid fa-circle-check text-blue-700"></i>
              Access to PYQ Companies
            </li>
          </ul>
          {/* button centered */}
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-blue-700 text-white p-2 lg:px-6 lg:py-3 rounded-md hover:scale-105 transition-transform duration-300 ease-in-out text-lg sm:text-xl font-semibold"
          >
            Enroll Now
          </button>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/3 hidden xl:flex justify-start items-center">
          <img
            src={teacherImg}
            alt="teacher"
            className="w-[220px] sm:w-[280px] md:w-[320px] lg:w-[360px]"
          />
        </div>
      </section>

      {/* SECTION 2: Key Features */}
      <section id="sigma-two" className=" bg-[#e9f2fd] py-10 px-4">
        <h2 className="text-center text-3xl sm:text-2xl md:text-3xl font-bold mb-10 p-1 md:p-5">
          We build,your <span className="text-blue-700 underline">Skills</span>
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 md:px-52">
          <li className="w-full">
            <CourseDetailsCard
              heading="MERN Stack Development"
              skills={[
                "HTML",
                "CSS",
                "JavaScript",
                "React.js",
                "Node.js",
                "MongoDB",
              ]}
            />
          </li>
          <li className="w-full">
            <CourseDetailsCard
              heading="Data Structures & Algorithms"
              skills={[
                "Arrays",
                "Linked Lists",
                "Stacks & Queues",
                "Trees",
                "Graphs",
                "Dynamic Programming",
              ]}
            />
          </li>
          <li className="w-full">
            <CourseDetailsCard
              heading="Hands on Live Projects"
              skills={[
                "Git & GitHub",
                "Team Collaboration",
                "API Integration",
                "Error Handling",
                "Deployment",
                "CI/CD",
              ]}
            />
          </li>
        </ul>
      </section>

      {/* SECTION 3: Student Reviews */}
      <section id="sigma-three" className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-8">
            Reviews From <span className="text-blue-700">Students</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {jobCandidates ? (
              jobCandidates.map((candidate, i) => (
                <StudentCard key={i} data={candidate} />
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sigma;
