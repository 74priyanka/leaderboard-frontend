import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { auth } = useContext(AuthContext);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="max-w-7xl mx-auto flex justify-between">
        <div className="flex space-x-4">
          <div>
            {auth.user ? (
              <>
                <span className="mr-4">{auth.user.name}</span>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-400 mr-4">
                  Login
                </Link>
                <Link to="/register" className="hover:text-blue-400">
                  Register
                </Link>
              </>
            )}
          </div>
          <Link to="/" className="hover:text-blue-400">
            Home
          </Link>
          <Link to="/leaderboard" className="hover:text-blue-400">
            Leaderboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
