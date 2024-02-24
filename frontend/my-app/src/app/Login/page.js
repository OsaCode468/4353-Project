"use client";
import Navbar from "../components/Navbar";
import { useState } from "react";
export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(username, password)
  }
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center mt-10">
        <div className="flex flex-col w-72 h-72 items-center bg-white rounded-lg">
          <h1 className="text-black pt-7">Login</h1>
          <div className="flex flex-col items-center justify-center h-full">
            <form className="flex flex-col items-center gap-5" onSubmit = {handleSubmit}>

              <input
                placeholder="username"
                className="border border-black px-2 py-1 text-black"
                required
                value = {username}
                onChange = {(e) => setUsername(e.target.value)}
              ></input>
              <input
                placeholder="password"
                className="border border-black px-2 py-1 text-black"
                required
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
              ></input>
              <button className=" w-20 text-black border border-solid border-black">Add</button>
            </form>
          </div>
          <a className = "text-black" href = "/Registration">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
