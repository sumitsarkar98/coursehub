import React, { useState, useEffect } from "react";
import CourseShowcase from "../components/CourseShowCase";
import axios from "axios";

const Allcourses = () => {
  const [searchTerm, setSearchTerm] = useState(""); // consistent naming
  const [courses, setCourses] = useState([]); // renamed from 'foods'
  const [error, setError] = useState("");

  // Fetch all courses once on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user/allcourses");
        setCourses(res.data.courseData || []); // make sure to handle the structure from backend
      } catch (error) {
        setError("Failed to load course data.");
        console.error("Fetch error:", error);
      }
    };

    fetchCourses();
  }, []);

  // Filtered courses based on search term
  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section
      id="course-cards"
      className="flex flex-col  gap-3 px-2 md:px-12 lg:px-32 py-24 md:py-36 xl:pt-32"
    >
      {/* Search Bar */}
      <div className="mb-4 flex justify-center items-center">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2  px-4 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Course Cards */}
      {searchTerm.trim() !== "" && filteredCourses.length === 0 ? (
        <p className="text-center text-gray-500">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(searchTerm.trim() !== "" ? filteredCourses : courses).map(
            (course) => (
              <CourseShowcase key={course.id} course={course} />
            )
          )}
        </div>
      )}
    </section>
  );
};

export default Allcourses;
