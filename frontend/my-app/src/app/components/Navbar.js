const Navbar = () =>{
    return (
        <div className="flex items-center justify-center bg-lime-500 h-48">
          <ul className = "flex gap-5">
            <a href = "/">
              <li>Home</li>
            </a>
            <li>Registration</li>
            <a href = "login">
              <li>Login</li>
            </a>
            <li>Client Profile Management</li>
            <li>Fuel Quote Form</li>
            <li>Fuel Quote History</li>
          </ul>
        </div>
      );
}
export default Navbar