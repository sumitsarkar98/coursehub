import react, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import CourseShowcase from "../components/CourseShowCase";

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableCourse, setAvailableCourses] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user/dashboard", {
          withCredentials: true,
        });

        const data = res.data.dashboardData;

        if (data.length > 0) {
          const { name, email, gender, role, joining_date } = data[0];
          setUserDetails({ name, email, gender, role, joining_date });

          const courseList = data.map((item) => ({
            course: item.course,
            start_course: item.start_course,
            progress: item.progress,
          }));
          setCourses(courseList);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchavailableCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/user/dashboardcourses",
          {
            withCredentials: true,
          }
        );

        const data = res.data.availableCourses;

        if (data.length > 0) {
          setAvailableCourses(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchavailableCourses();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex mt-[90px]">
      {/* Sidebar */}
      <aside className="bg-gray-800 text-white w-64 fixed h-screen p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-4">CourseHub</h2>
        <ul className="space-y-4">
          <li className="hover:text-yellow-400 cursor-pointer">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-yellow-400 cursor-pointer">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="text-white hover:text-yellow-400 cursor-pointer">
            <a
              href="#myCourses"
              className="text-white hover:text-yellow-400 cursor-pointer"
            >
              My Courses
            </a>
          </li>
          <li className="hover:text-yellow-400 cursor-pointer">
            <a href="#">Settings</a>{" "}
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex gap-5 flex-wrap max-h-screen overflow-y-auto p-6 bg-gray-50 ml-0 md:ml-64 ">
        {/* User Details */}
        {userDetails && (
          <section className="w-full mb-8 bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <strong>Name:</strong> {userDetails.name}
              </div>
              <div>
                <strong>Email:</strong> {userDetails.email}
              </div>
              <div>
                <strong>Gender:</strong> {userDetails.gender}
              </div>
              <div>
                <strong>Role:</strong> {userDetails.role}
              </div>
              <div>
                <strong>Joined On:</strong>{" "}
                {new Date(userDetails.joining_date).toLocaleDateString()}
              </div>
            </div>
          </section>
        )}

        {/* Enrolled Courses */}
        <section
          id="myCourses"
          className="w-full bg-white shadow-md rounded-xl p-6"
        >
          <h2 className="text-xl font-bold mb-4">My Courses</h2>
          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 p-4 rounded-lg shadow-sm"
                >
                  <div>
                    <strong>Course:</strong> {course.course}
                  </div>
                  <div>
                    <strong>Started On:</strong>{" "}
                    {new Date(course.start_course).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Progress:</strong> {course.progress}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              You have not enrolled in any course yet.
            </p>
          )}
        </section>

        {/* less available courses */}
        <section className="w-full bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl text-center font-bold mb-12  text-blue-900">
            Available Courses for You
          </h3>

          {availableCourse.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {availableCourse.map((course, i) => (
                <CourseShowcase key={i} course={course} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              No more courses available right now.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
