import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-lime-500 h-48">
      <ul className = "flex gap-5">
        <li>Home</li>
        <h1>Registration</h1>
        <li>Login</li>
        <h1>Client Profile Management</h1>
        <h1>Fuel Quote Form</h1>
        <h1>Fuel Quote History</h1>
      </ul>
    </div>
  );
}
