import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiOutlineHomeModern } from "react-icons/hi2";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-[#122035] border-b border-[#1E2E46] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-[#F7F4EF]"
        >
          <HiOutlineHomeModern className="text-[#F5A623]" size={26} />
          <p>
            Prop<span className="text-[#F5A623]">Space</span>
          </p>
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            to="/"
            className="text-[#8896AB] hover:text-[#F7F4EF] transition-colors"
          >
            Marketplace
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-[#8896AB] hover:text-[#F7F4EF] transition-colors"
              >
                My Listings
              </Link>
              <Link
                to="/profile"
                className="text-[#8896AB] hover:text-[#F7F4EF] transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="bg-[#1E2E46] hover:bg-red-950/40 text-red-400 border border-red-900/30 px-4 py-2 rounded-lg transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[#8896AB] hover:text-[#F7F4EF] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-[#F5A623] hover:bg-[#E0921B] text-[#0F1B2D] px-4 py-2 rounded-lg font-bold transition-all"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
