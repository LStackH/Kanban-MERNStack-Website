import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { LogoutButton } from "./Buttons/LogoutButton";

function Navbar() {
  const { token } = useAuth(); // read the token from context

  return (
    <nav className="bg-blue-950 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left side, title/logo */}
        <Link to="/" className="text-xl font-bold text-white">
          MyKanban
        </Link>

        {/* Right side, login/register/logout */}
        <div className="space-x-4">
          {token ? (
            // If user is logged in, show logout
            <LogoutButton />
          ) : (
            // If user isn't logged in, show login + register
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


export default Navbar