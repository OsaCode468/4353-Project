import Navbar from "../components/Navbar";

export default function Login() {
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center mt-24">
        <div className="flex flex-col w-72 h-72 items-center bg-white rounded-lg">
          <h1 className="text-black pt-7">Login</h1>
          <div className="flex flex-col items-center justify-center h-full">
            <form className="flex flex-col items-center gap-5">
              <input
                placeholder="username"
                className="border border-black px-2 py-1"
              ></input>
              <input
                placeholder="password"
                className="border border-black px-2 py-1"
              ></input>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
