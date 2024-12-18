import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Lerror() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    orderNo: "",
    listing: "",
    description: "",
    errorType: "",
    error: "",
    platform: "",
  });
  console.log(formData);

  let email;
  const token = localStorage.getItem("authToken");
  if (token) {
    let decoded = jwtDecode(token);
    email = decoded.email;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://backendaform-production.up.railway.app/aform/LE",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: email,
            orderNo: formData.orderNo,
            listing: formData.listing,
            description: formData.description,
            errorType: formData.errorType,
            error: formData.error,
            platform: formData.platform,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("failed to fetch");
      }
      alert("form submitted!");
      navigate("/aform");
    } catch (e) {
      setErrorMessage(e.message);
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
            onChange={handleChange}
            type="text"
            id="OrderNumber"
            className="bg-[#68C5DB] border border-[#02182b] text-gray-900 text-sm rounded-lg focus:ring-[blue-500] focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:[ring-blue-500] dark:focus:border-blue-500"
            placeholder="Order Number"
            required
            name="orderNo"
          />
          <input
            onChange={handleChange}
            id="LI"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Listing Number / ASIN "
            required
            type="text"
            name="listing"
          />

          <input
            onChange={handleChange}
            id="Description"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Description"
            type="text"
            required
            name="description"
          />

          <select
            onChange={handleChange}
            id="errrType"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            required
            name="errorType"
          >
            <option disabled selected value={""}>
              Error type
            </option>
            <option id="LE">Listing error</option>
            <option id="TE">Title error</option>
            <option id="ACES">ACES error</option>
            <option id="DE">Description error</option>
          </select>
          <input
            onChange={handleChange}
            id="ED"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Error Detected"
            type="text"
            required
            name="error"
          />
          <select
            onChange={handleChange}
            id="plat"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            required
            name="platform"
          >
            <option disabled selected value={""}>
              Platform
            </option>
            <option id="eBay">eBay</option>
            <option id="Amazon">Amazon</option>
            <option id="DA">Detroit Axle Website</option>
            <option id="DS">Drop shippers</option>
            <option id="Wal">Walmart</option>
          </select>
          <button className="bg-[#02182b] text-[#68C5DB] p-3 rounded-lg">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
