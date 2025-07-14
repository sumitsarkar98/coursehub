import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { authContext } from "./context/authContext.js";

import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Sigma from "./pages/Sigma";
import Allcourses from "./pages/Allcourses";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashBoard from "./pages/DashBoard";
import OrderNow from "./pages/OrderNow.jsx";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

const App = () => {
  const [isLogedin, setLogedin] = useState(false);
  return (
    <authContext.Provider value={{ isLogedin, setLogedin }}>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sigma" element={<Sigma />} />
            <Route path="/allcourses" element={<Allcourses />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/order" element={<OrderNow />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </authContext.Provider>
  );
};

export default App;
