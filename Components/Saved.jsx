import { jwtDecode } from "jwt-decode";
import { useState } from "react";
export default function Saved() {
  let email;
  const token = localStorage.getItem("authToken");
  if (token) {
    let decode = jwtDecode(token);
    email = decode.email;
  }
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    orderNo: "",
    RFR: "",
    actionTaken: "",
    describeAction: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://backendaform-production.up.railway.app/aform/SS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: email,
            orderNo: formData.orderNo,
            RFR: formData.RFR,
            actionTaken: formData.actionTaken,
            describeAction: formData.describeAction,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to post");
      }
      alert("Form submit successfully");
      window.location.href = "/aform/aform/";
    } catch (e) {
      setErrorMessage(e.message);
    }
  };
  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#02182b]">
      {/* Background blur container */}
      {errorMessage ? <p className="text-400">{errorMessage}</p> : null}
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
            id="Reason"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Reason of return or cancellation"
            required
            type="Text"
            name="RFR"
          />
          <select
            onChange={handleChange}
            id="action"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Action"
            required
            type="text"
            name="actionTaken"
          >
            <option selected disabled value={""}>
              Action
            </option>
            <option id="PR">Partial Refund</option>
            <option id="EXC">Exchange</option>
            <option id="RP">Replacement for defective parts</option>
            <option id="RSH">Reshipment for missing parts</option>
          </select>

          <input
            onChange={handleChange}
            id="Description"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Describe action ( How much did we save by taking this action ? ) "
            type="text"
            name="describeAction"
          />

          <button className="bg-[#02182b] text-[#68C5DB] p-3 rounded-lg">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
