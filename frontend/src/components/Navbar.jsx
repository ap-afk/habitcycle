import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-700";

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="text-xl font-bold text-blue-600">
            HabitCycle
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 text-sm">
            <Link to="/home" className={isActive("/home")}>Home</Link>
            <Link to="/leaderboard" className={isActive("/leaderboard")}>Leaderboard</Link>
            <Link to="/profile" className={isActive("/profile")}>Profile</Link>
          </div>

          {/* Desktop Logout */}
          <button
            onClick={handleLogout}
            className="hidden md:block px-4 py-2 text-sm border rounded-lg text-red-600 hover:bg-red-50"
          >
            Logout
          </button>

          {/* Mobile Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 md:hidden
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 space-y-6 text-sm">
          <button
            className="mb-6 text-gray-500"
            onClick={() => setIsOpen(false)}
          >
            ✕ Close
          </button>

          <Link to="/home" className={`block ${isActive("/home")}`}>Home</Link>
          <Link to="/leaderboard" className={`block ${isActive("/leaderboard")}`}>Leaderboard</Link>
          <Link to="/profile" className={`block ${isActive("/profile")}`}>Profile</Link>

          <button
            onClick={handleLogout}
            className="w-full text-left text-red-600 pt-6 border-t"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
