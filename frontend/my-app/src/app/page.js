import Image from "next/image";
import Navbar from "./components/Navbar";
export default function Home() {
  return (
    <div>
      <Navbar/>
      <div className="text-center mt-20">
        <h1 className="text-4xl font-bold tracking-tight text-white-900 sm:text-6xl">Welcome to Fuel Rate Calculator!</h1>
        <h2 className="mt-6 text-lg leading-8 text-white-600">How would you like to continue?</h2>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button><a href = "/Registration" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</a></button>
          <button><a href = "/Login" className="text-sm font-semibold leading-6 text-white-900">Login</a></button>
        </div>
      </div>
    </div>
  );
}
