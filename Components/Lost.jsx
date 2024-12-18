import { useState } from "react";
import { jwtDecode } from "jwt-decode";
export default function Lost() {
  let email;
  const token = localStorage.getItem("authToken");
  if (token) {
    const decoded = jwtDecode(token);
    email = decoded.email;
  }

  const [formData, setFormData] = useState({
    date: "",
    orderNo: "",
    tracking: "",
    lostdamaged: "",
    warehouse: "",
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", email);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("orderNo", formData.orderNo);
      formDataToSend.append("tracking", formData.tracking);
      formDataToSend.append("lostdamaged", formData.lostdamaged);

      formDataToSend.append("warehouse", formData.warehouse);
      formDataToSend.append("image", formData.image); // Append the image file
      console.log({ formDataToSend });

      const response = await fetch(
        "https://backendaform-production.up.railway.app/aform/Lost",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("failed to submit");
      }

      alert("form submitted");
      window.location.href = "/aform/aform/";
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
            placeholder="Tracking Number"
            required
            type="text"
            name="tracking"
          />

          <select
            onChange={handleChange}
            id="Lost"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            required
            name="lostdamaged"
          >
            <option disabled selected value={""}>
              Lost / Damaged
            </option>
            <option id="Lost">Lost Package</option>
            <option id="Damaged">Damaged Package</option>
            <option id="Wrong">
              Delivered to the wrong address and the proof of delivery shows
              that
            </option>
          </select>

          <select
            onChange={handleChange}
            id="wh"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            required
            name="warehouse"
          >
            <option disabled selected value={""}>
              Warehouse
            </option>
            <option id="DAXDT">DAXDT</option>
            <option id="DAXJZ">DAXJZ</option>
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