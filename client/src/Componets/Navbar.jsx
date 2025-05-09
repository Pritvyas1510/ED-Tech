import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContex/AuthContex";

// Role-based navbar configuration
const navbarConfig = {
  student: {
    title: "EdTech",
    links: [
      { name: "Home", url: "/" },
      { name: "My Courses", url: "/mycourses" },
      { name: "All Courses", url: "/allcourses" },
      { name: "About Us", url: "/about" },
    ],
  },
  instructor: {
    title: "EdTech",
    links: [
      { name: "Home", url: "/" },
      { name: "Courses", url: "/createcourses" },
      { name: "Manage Sections", url: "/section-manager" },
      { name: "Dashboard", url: "/teacherhome" },
      { name: "About Us", url: "/about" },
    ],
  },
  admin: {
    title: "EdTech",
    links: [
      { name: "Home", url: "/" },
      { name: "Teachers", url: "/adminhome" },
      { name: "Categories", url: "/category" },
      { name: "All user", url: "/alluser" },
      { name: "About Us", url: "/about" },
    ],
  },
  guest: {
    title: "EdTech",
    links: [
      { name: "Home", url: "/" },
      { name: "About Us", url: "/about" },
    ],
  },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const role = user?.role || "guest";
  const config = navbarConfig[role];

  return (
    <div>
      <div className="navbar bg-gray-50 text-black">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-gray-100 text-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              {config.links.map((link, index) => (
                <li key={index}>
                  <Link to={link.url}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="navbar-start">
            <Link to="/" className="flex gap-2 text-xl">
              <div>
                <img src="/Image/MainLogo.png" alt="Logo" className="w-12" />
              </div>
              <div className="p-1 flex">
                <p className="text-black text-4xl">Ed</p>
                <p className="text-blue-800 text-4xl">Tech</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {config.links.map((link, index) => (
              <li key={index}>
                <Link to={link.url}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end text-2xl">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src={user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-gray-100 text-black rounded-box z-10 mt-3 w-52 p-1 text-2xl shadow"
            >
              {user ? (
                <>
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <button onClick={logout}>Logout</button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login">Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;