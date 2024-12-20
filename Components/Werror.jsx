import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Werror() {
  let email;
  const token = localStorage.getItem("authToken");
  if (token) {
    const decoded = jwtDecode(token);
    email = decoded.email;
  }
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    orderNo: "",
    partNumber: "",
    warehouse: "",
    description: "",
    issue: "",
    image: null,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    console.log(type, "hi");

    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0], // Handle file input
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  console.log(formData.image);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", email);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("orderNo", formData.orderNo);
      formDataToSend.append("partNumber", formData.partNumber);
      formDataToSend.append("warehouse", formData.warehouse);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("issue", formData.issue);
      formDataToSend.append("image", formData.image); // Append the image file
      console.log({ formDataToSend });

      const response = await fetch(
        "https://backendaform-production.up.railway.app/aform/WE",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend, // Send FormData directly as the body
        }
      );

      if (!response.ok) {
        throw new Error("failed to submit");
      }

      alert("form submitted");
      navigate("/#/aform/");
      console.log(response);
    } catch (e) {
      console.log(e, "error");

      setErrorMessage(e.message);
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#02182b]">
      {/* Background blur container */}
      <div className="absolute inset-0 bg-[#6f8eae]/70 backdrop-blur-md"></div>
      {errorMessage ? <p className="text-red-600">{errorMessage}</p> : null}

      {/* Main Content */}
      <div className="relative z-10 flex justify-center items-center flex-grow">
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-5 p-6 rounded-xl border-2 h-[28rem] w-[20rem] border-[#02182b] bg-[#274768]/80 shadow-xl"
        >
          <input
            onChange={handleChange}
            type="date"
            id="Date"
            className="bg-[#68C5DB] border border-[#02182b] text-gray-900 text-sm rounded-lg focus:ring-[blue-500] focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:[ring-blue-500] dark:focus:border-blue-500"
            placeholder="Order Date"
            required
            name="date"
          />
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
            id="PN"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Part Number"
            required
            type="text"
            name="partNumber"
          />
          <select
            onChange={handleChange}
            id="warehouse"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            required
            name="warehouse"
          >
            <option disabled selected value={""}>
              Warehouse
            </option>
            <option id="DT">DAXDT</option>
            <option id="JZ">DAXJZ</option>
          </select>

          <input
            onChange={handleChange}
            id="Description"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Description"
            type="text"
            name="description"
          />

          <select
            onChange={handleChange}
            id="warehouse"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            required
            name="issue"
          >
            <option disabled selected value={""}>
              Issue
            </option>
            <option id="miss">Missing</option>
            <option id="Damage">Packaging / Damaged</option>
            <option id="Wrong">Wrong</option>
            <option id="SL">Parts don't appear on the shipment line</option>
          </select>

          <input
            onChange={handleChange}
            className="block w-full text-sm text-[#68C5DB] bg-[#02182b] border border-[#68C5DB] rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#68C5DB] focus:border-[#68C5DB]"
            placeholder="Packing Slip"
            type="file"
            name="image"
          />
          <button className="bg-[#02182b] text-[#68C5DB] p-3 rounded-lg">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
