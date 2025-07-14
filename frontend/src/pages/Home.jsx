import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import character from "../assets/character.png";
import bgimage from "../assets/bgimage.png";
import StudentCard from "../components/JobCandidates.jsx";

const Home = () => {
  const [jobCandidates, setJobCandidates] = useState(null);
  const [error, setError] = useState("");

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
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center mt-24 md:mt-[90px)] bg-[#d9d9d9]">
      {/* section-one */}
      <section
        id="one"
        className="shadow-md w-full lg:min-h-[90vh] bg-contain bg-center bg-no-repeat flex flex-col lg:flex-row items-center justify-center px-4 py-10 sm:px-8 md:px-12"
        style={{ backgroundImage: `url(${bgimage})` }}
      >
        {/* Left Side */}
        <div className="w-full  justify-center items-center lg:w-1/2 bg-transparent flex lg:justify-end  py-8 px-2 lg:px-4 sm:px-6">
          <div className="text-center space-y-5">
            <h3 className="text-base md:text-xl font-medium text-white uppercase">
              learn & become
            </h3>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-yellow-500">
              Top 1%
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white uppercase  mt--10">
              developer
            </h1>
            <button
              onClick={() => navigate("/Sigma")}
              className="bg-blue-900 text-yellow-500 font-semibold p-2 lg:px-5 lg:py-3 rounded-2xl text-lg sm:text-xl lg:text-2xl mt-16 uppercase hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              ultimate <span className="text-white">placement solution</span>
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 hidden lg:flex justify-start items-center">
          <img
            src={character}
            alt="character"
            className="w-3/4 lg:w-3/5 object-contain"
          />
        </div>
      </section>

      {/* section-two */}
      <section id="two" className="w-full">
        <div
          id="two-heading"
          className=" flex  justify-center items-center text-center"
        >
          <h2 className="text-3xl sm:text-4xl capitalize font-semibold p-2 lg:p-4">
            india's most loved coding community.
          </h2>
        </div>

        <ul
          id="two-options"
          className="flex flex-row flex-wrap justify-around items-center"
        >
          <li className="p-4 shadow-md">
            <h2 className="text-xl lg:text-3xl font-bold uppercase text-center">
              60,000+
            </h2>
            <h2 className="text-2xl mt-2 uppercase">happy learners</h2>
          </li>
          <li className="p-4 shadow-md">
            <h2 className="text-xl lg:text-3xl font-bold uppercase text-center">
              2 Cr
            </h2>
            <h2 className="text-2xl mt-2 uppercase">monthly views</h2>
          </li>
          <li className="p-4 shadow-md">
            <h2 className="text-xl lg:text-3xl font-bold uppercase text-center">
              10,000+
            </h2>
            <h2 className="text-2xl mt-2 uppercase">new subscribers</h2>
          </li>
        </ul>
      </section>

      {/* section-three */}
      <section
        id="three"
        className="w-full flex flex-col justify-center items-center p-5 lg:p-30 bg-white"
      >
        <hr className="bg-black h-[3px] w-full mb-12" />
        <h4 className=" text-xl lg:text-4xl text-center capitalize">
          placement prep batchs
        </h4>
        <h3 className="text-center">sigma 8.0 : development + dsa</h3>
        <h4 className=" text-xl lg:text-3xl text-center capitalize">
          start your placement journey today with us.
        </h4>
        <button
          onClick={() => navigate("/allcourses")}
          className="explore-btn text-xl capitalize mt-5"
        >
          explore now
        </button>
        <hr className="bg-black h-[3px] w-full mt-12" />
      </section>

      {/* section-four */}
      <section className="w-full flex flex-col items-center p-8 md:p-0 md:pb-20 text-center bg-white  ">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 md:mb-12 ">
          Thousands of students got their
          <span className="ms-2 text-2xl sm:text-3xl text-blue-800 underline">
            dream job
          </span>
        </h3>

        <div className=" p-1 md:p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-20">
          {jobCandidates ? (
            jobCandidates.map((candidate, i) => (
              <StudentCard key={i} data={candidate} />
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
