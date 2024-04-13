"use client"
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () =>{
  const {dispatch} = useAuthContext();
  const {user} = useAuthContext();
  const handleClick = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };
    return (
        <div className="flex items-center justify-center bg-lime-500 h-32">
          <ul className = "flex gap-5">
            <a href = "/">
              <li>Home</li>
            </a>
            <a href="/Registration/">
              <li>Registration</li>
            </a>
            <a href = "Login/">
              <li>Login</li>
            </a>
            <a href="ClientProfileManagement/">
              <li>Client Profile Management</li>
            </a>
            <a href="FuelQuoteForm/">
              <li>Fuel Quote Form</li>
            </a>
            <a href="FuelQuoteHistory/">
              <li>Fuel Quote History</li>
            </a>
            {user && (<div className ="flex gap-6"><span>{user.username ? user.username: user}</span> <button onClick={handleClick}>Logout</button>
              </div>)}
          </ul>
        </div>
      );
}
export default Navbar