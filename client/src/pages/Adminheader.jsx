import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { RxExit } from 'react-icons/rx';

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  // Logout function
  async function logout() {
    try {
        navigate("/"); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <header className='flex py-2 px-6 sm:px-6 justify-between place-items-center'>
      {/* Logo / Home Link */}
      <Link to={'/admin-dashboard'} className="flex items-center">
        <img src="../src/assets/logo.png" alt="Logo" className='w-26 h-9' />
      </Link>

      {/* Sign Out Button */}
      { (
        <div onClick={logout} className="flex items-center cursor-pointer">
          <RxExit className="w-5 h-5 mr-2 text-primary" />
          <span className="text-primary hover:text-primarydark font-bold">Admin Sign Out</span>
        </div>
      )}
    </header>
  );
}
