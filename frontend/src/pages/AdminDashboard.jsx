import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [formMode, setFormMode] = useState(""); // 'add', 'edit', 'delete'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/profile", {
          withCredentials: true,
        });
        setAdminDetails(res.data.user || []);
      } catch (err) {
        console.error("Failed to fetch admin details : ", err);
      }
    };

    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/admin/allcourses",
          {
            withCredentials: true,
          }
        );
        setAllCourses(data.courses || []);
      } catch (error) {
        console.error("Failed to fetch all courses:", error);
      }
    };

    fetchAdminDetails();
    fetchCourses();
  }, []);

  const handleAddCourse = () => {
    setFormMode("add");
    setCourseForm({ title: "", description: "", price: "" });
    setThumbnail(null);
    setVideo(null);
    setShowForm(true);
  };

  const handleEditCourse = (course) => {
    setFormMode("edit");
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      price: course.price,
    });
    setThumbnail(null); // Reset in case they want to upload new one
    setVideo(null);
    setShowForm(true);
  };

  const handleDeleteCourse = (course) => {
    setFormMode("delete");
    setSelectedCourse(course);
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formMode === "add") {
        const formData = new FormData();
        formData.append("title", courseForm.title);
        formData.append("description", courseForm.description);
        formData.append("price", courseForm.price);
        formData.append("instructor_id", adminDetails?.id);
        if (thumbnail) formData.append("thumbnail", thumbnail);
        if (video) formData.append("promoVideo", video); // ✅ FIXED here

        await axios.post("http://localhost:3000/admin/addcourse", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (formMode === "edit") {
        const formData = new FormData();
        formData.append("title", courseForm.title);
        formData.append("description", courseForm.description);
        formData.append("price", courseForm.price);
        if (thumbnail) formData.append("thumbnail", thumbnail);
        if (video) formData.append("promoVideo", video); // ✅ FIXED here

        await axios.put(
          `http://localhost:3000/admin/updatecourse/${selectedCourse.id}`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else if (formMode === "delete") {
        await axios.delete(
          `http://localhost:3000/admin/deletecourse/${selectedCourse.id}`,
          {
            withCredentials: true,
          }
        );
      }

      // Refresh course list
      const { data } = await axios.get(
        "http://localhost:3000/admin/allcourses",
        {
          withCredentials: true,
        }
      );

      setAllCourses(data.courses || []);
      setShowForm(false);
    } catch (err) {
      console.error("Course operation failed:", err);
    }
  };

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
          <li className="hover:text-yellow-400 cursor-pointer">
            <a href="#myCourses">My Courses</a>
          </li>
          <li className="hover:text-yellow-400 cursor-pointer">
            <a href="#">Settings</a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6 p-6 bg-gray-50 ml-0 md:ml-64">
        {adminDetails && (
          <section className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <strong>Name:</strong> {adminDetails.full_name}
              </div>
              <div>
                <strong>Email:</strong> {adminDetails.email}
              </div>
              <div>
                <strong>Gender:</strong> {adminDetails.gender}
              </div>
              <div>
                <strong>Role:</strong> {adminDetails.role}
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Form */}
        {showForm && (
          <form
            onSubmit={handleFormSubmit}
            className="space-y-4 bg-white p-6 rounded shadow-md"
            encType="multipart/form-data"
          >
            {formMode !== "delete" ? (
              <>
                <input
                  type="text"
                  placeholder="Title"
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={courseForm.price}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, price: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />

                {formMode === "add" && (
                  <>
                    <label htmlFor="thumbnail">Thumbnail</label>
                    <input
                      name="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnail(e.target.files[0])}
                      className="w-full p-2 border rounded"
                    />
                    <label htmlFor="video">Video</label>
                    <input
                      name="video"
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideo(e.target.files[0])}
                      className="w-full p-2 border rounded"
                    />
                  </>
                )}
              </>
            ) : (
              <p>
                Are you sure you want to delete{" "}
                <strong>{selectedCourse.title}</strong>?
              </p>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className={`${
                  formMode === "delete"
                    ? "bg-red-600"
                    : formMode === "edit"
                    ? "bg-yellow-500"
                    : "bg-green-600"
                } text-white px-4 py-2 rounded`}
              >
                {formMode === "add"
                  ? "Create"
                  : formMode === "edit"
                  ? "Update"
                  : "Confirm Delete"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* All Courses */}
        <section className="bg-white shadow-md rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Manage Courses</h2>
            <button
              onClick={handleAddCourse}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Course
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCourses.map((course) => (
              <div
                key={course.id}
                className="border p-4 rounded-lg shadow bg-gray-100"
              >
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-sm mb-2">{course.description}</p>
                <p className="text-sm font-semibold">Price: ₹{course.price}</p>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="bg-yellow-400 px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
