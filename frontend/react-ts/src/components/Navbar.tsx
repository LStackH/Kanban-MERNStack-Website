import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { LogoutButton } from "./Buttons/LogoutButton";
import { useSearch } from "../context/SearchContext";

function Navbar() {
  const { token } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <nav className="bg-blue-950 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Side: Title */}
        <Link to="/" className="text-xl font-bold text-white">
          MyKanban
        </Link>

        {/* Right Side: Search/Login&Logout/Register */}
        <div className="flex items-center space-x-4">
          {token ? (
            <>
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded"
              />
              <LogoutButton />
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
