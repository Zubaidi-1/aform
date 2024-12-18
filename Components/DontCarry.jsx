import { useState } from "react";

import { jwtDecode } from "jwt-decode";
export default function Carry() {
  let email;
  const token = localStorage.getItem("authToken");
  if (token) {
    const decoded = jwtDecode(token);
    email = decoded.email;
  }
  const [formData, setFormData] = useState({ partName: "", specs: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://backendaform-production.up.railway.app/aform/PWDC",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: email,
            partName: formData.partName,
            specs: formData.specs,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("failed to submit");
      }
      alert("form submitted");
      window.location.href = "/aform";
    } catch (e) {
      setErrorMessage(e.message);
    }
  };
  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#02182b]">
      {/* Background blur container */}
      {errorMessage ? <p className="text-red-600">{errorMessage}</p> : null}
      <div className="absolute inset-0 bg-[#6f8eae]/70 backdrop-blur-md"></div>

      {/* Main Content */}
      <div className="relative z-10 flex justify-center items-center flex-grow">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-5 p-6 rounded-xl border-2 h-[28rem] w-[20rem] border-[#02182b] bg-[#274768]/80 shadow-xl"
        >
          <input
            onChange={handleChange}
            type="text"
            id="PartName"
            className="bg-[#68C5DB] border border-[#02182b] text-gray-900 text-sm rounded-lg focus:ring-[blue-500] focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:[ring-blue-500] dark:focus:border-blue-500"
            placeholder="Part Name"
            required
            name="partName"
          />
          <input
            onChange={handleChange}
            id="Amount"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Car specifications"
            required
            type="text"
            name="specs"
          />

          <button className="bg-[#02182b] text-[#68C5DB] p-3 rounded-lg">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
