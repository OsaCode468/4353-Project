const Navbar = () =>{
    return (
        <div className="flex items-center justify-center bg-lime-500 h-48">
          <ul className = "flex gap-5">
            <a href = "/">
              <li>Home</li>
            </a>
            <h1>Registration</h1>
            <a href = "login">
              <li>Login</li>
            </a>
            <h1>Client Profile Management</h1>
            <h1>Fuel Quote Form</h1>
            <h1>Fuel Quote History</h1>
          </ul>
        </div>
      );
}
export default Navbar