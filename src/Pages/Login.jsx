import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData);

      const response = await fetch("http://localhost:3001/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Message:", data.message);
        console.log("Token:", data.token);
        console.log("User ID:", data.userId);
        localStorage.setItem("authToken", data.token);
        window.location.href = "/aform";
      } else if (response.status === 422) {
        const data = await response.json();

        setErrorMessage(data.errors.map((err) => err.msg).join(", "));
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Signup failed.");
      }
    } catch (error) {
      console.log(error, " An error has occured");

      setErrorMessage(" An error has occured");
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#02182b]">
      {/* Background blur container */}
      <div className="absolute inset-0 bg-[#6f8eae]/70 backdrop-blur-md"></div>

      {/* Main Content */}
      <div className="relative z-10 flex justify-center items-center flex-grow">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-5 p-6 rounded-xl border-2 h-[28rem] w-[20rem] border-[#02182b] bg-[#274768]/80 shadow-xl"
        >
          <input
            type="text"
            id="Email"
            name="email"
            className="bg-[#68C5DB] border border-[#02182b] text-gray-900 text-sm rounded-lg focus:ring-[blue-500] focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:[ring-blue-500] dark:focus:border-blue-500"
            placeholder="Email"
            required
            onChange={handleChange}
          />
          <input
            id="Order"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Password"
            required
            type="password"
            name="password"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-[#02182b] text-[#68C5DB] p-3 rounded-lg"
          >
            Login
          </button>
          <button
            type="submit"
            className="bg-[#02182b] text-[#68C5DB] p-3 rounded-lg"
          >
            <Link to={"/signup"}>Sign up</Link>
          </button>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}
