import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function LogoutButton() {
    const navigate = useNavigate();
    const { logout } = useAuth(); // from context
  
    function handleLogout() {
      // Clears context state + localStorage
      logout();
      // Then redirect
      navigate("/login");
    }
  
    return (
      <button onClick={handleLogout} className="text-white hover:text-gray-300">
        Logout
      </button>
    );
}