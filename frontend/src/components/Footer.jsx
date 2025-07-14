import React from "react";
import LOGO from "../assets/LOGO.svg";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 px-4 py-10 ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* footer-1 */}
        <div
          id="footer-1"
          className=" p-4 flex flex-col items-center md:items-start"
        >
          <img src={LOGO} alt="logo-img" className="max-h-20 mb-3" />
          <h3 className="text-gray-700 text-sm font-medium">
            where education meets the real world
          </h3>
        </div>

        {/* footer-2 */}
        <div
          id="footer-2"
          className=" flex flex-col justify-center items-center"
        >
          <h4 className="text-3xl font-semibold mb-2 text-decoration-underline">
            Useful Links
          </h4>
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                className="text-base text-gray-600 hover:text-blue-800"
              >
                Courses
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-base text-gray-600 hover:text-blue-800"
              >
                Privacy & Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-base text-gray-600 hover:text-blue-800"
              >
                Refund Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-base text-gray-600 hover:text-blue-800"
              >
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* footer-3 */}
        <div
          id="footer-3"
          className=" flex flex-col justify-center items-center"
        >
          <h4 className="text-3xl font-semibold mb-2 text-decoration-underline">
            Contact With Us
          </h4>
          <ul className="space-y-1">
            <li>
              <a
                href="mailto:support@example.com"
                className="text-base text-gray-600 hover:text-blue-800"
              >
                support@example.com
              </a>
            </li>
            <li>
              <a
                href="tel:+1234567890"
                className="text-base text-gray-600 hover:text-blue-800"
              >
                +1 234 567 890
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-base text-gray-600 hover:text-blue-800"
              >
                Live Chat
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-base text-gray-600 hover:text-blue-800"
              >
                Request Callback
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
