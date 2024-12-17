import { jwtDecode } from "jwt-decode";
import { useState } from "react";

export default function Spanish() {
  let email;
  const token = localStorage.getItem("authToken");
  if (token) {
    const decoded = jwtDecode(token);
    email = decoded.email;
  }
  const [formData, setFormData] = useState({ orderNo: null, phoneNumber: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch("http://localhost:3001/aform/SPA", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderNo: formData.orderNo,
          phoneNumber: formData.phoneNumber,
          email: email,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      alert("Submitted succesfully");
      window.location.href = "/aform/aform/";
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#02182b]">
      {/* Background blur container */}
      {errorMessage ? <p className="text-red-400">{errorMessage}</p> : null}
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
            id="Order Number"
            className="bg-[#68C5DB] border border-[#02182b] text-gray-900 text-sm rounded-lg focus:ring-[blue-500] focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:[ring-blue-500] dark:focus:border-blue-500"
            placeholder="Order#  Leave it empty if no order"
            name="orderNo"
          />
          <input
            onChange={handleChange}
            type="text"
            id="Phone"
            className="bg-[#68C5DB] border border-[#02182b] text-gray-900 text-sm rounded-lg focus:ring-[blue-500] focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:[ring-blue-500] dark:focus:border-blue-500"
            placeholder="Phone Number"
            required
            name="phoneNumber"
          />

          <button className="bg-[#02182b] text-[#68C5DB] p-3 rounded-lg">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
