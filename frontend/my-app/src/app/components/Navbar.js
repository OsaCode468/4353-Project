const Navbar = () =>{
    return (
        <div className="flex items-center justify-center bg-lime-500 h-48">
          <ul className = "flex gap-5">
            <a href = "/">
              <li>Home</li>
            </a>
            <a href="/Registration">
              <li>Registration</li>
            </a>
            <a href = "Login">
              <li>Login</li>
            </a>
            <a href="ClientProfileManagement">
              <li>Client Profile Management</li>
            </a>
            <a href="FuelQuoteForm">
              <li>Fuel Quote Form</li>
            </a>
            <a href="FuelQuoteHistory">
              <li>Fuel Quote History</li>
            </a>
          </ul>
        </div>
      );
}
export default Navbar