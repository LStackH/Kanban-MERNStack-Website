import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-950 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left side: brand or logo */}
        <Link to="/" className="text-xl font-bold text-white">
          MyKanban
        </Link>

        {/* Right side: nav links */}
        <div className="space-x-4">
          <Link to="/login" className="text-white hover:text-gray-300">
            Login
          </Link>
          <Link to="/register" className="text-white hover:text-gray-300">
            Register
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar