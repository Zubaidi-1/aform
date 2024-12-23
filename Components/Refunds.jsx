import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import useAuth from "./auth";
export default function Refunds() {
  useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  let email;
  const token = localStorage.getItem("authToken");
  console.log("token:", token);
  if (token) {
    let decodedtoken = jwtDecode(token);
    email = decodedtoken.email;
    console.log("emai", token);
  } else {
    navigate("/");
  }
  const [formData, setFormData] = useState({
    email: email,
    OrderNumber: "",
    Amount: "",
    ReasonForRefund: "",
    tracking: "",
    platform: "",
    Description: "",
    RFD: "",
  });
  const handleChange = function (e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log(formData);
  };

  const handleSubmit = async function (e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://backendaform-production.up.railway.app/aform/Refunds",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: formData.email,
            order: formData.OrderNumber,
            amount: formData.Amount,
            tracking: formData.tracking,
            platform: formData.platform,
            description: formData.Description,
            reasonForRefund: formData.ReasonForRefund,
            reasonForDiscount: formData.RFD,
          }),
        }
      );
      console.log(response, " res");
      console.log("hi");

      if (response.ok) {
        console.log("hello");

        alert("Refund successful!");
        navigate("/aform");
      }
    } catch (err) {
      console.log(err);
      setErrorMessage(err);
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
          className="flex flex-col justify-center items-center gap-5 p-6 rounded-xl border-2 h-[32rem] w-[20rem] border-[#02182b] bg-[#274768]/80 shadow-xl"
        >
          <input
            onChange={handleChange}
            type="text"
            id="email"
            className="bg-[#68C5DB] border border-[#02182b] text-gray-900 text-sm rounded-lg focus:ring-[blue-500] focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:[ring-blue-500] dark:focus:border-blue-500"
            value={email}
            disabled
            name="email"
          />
          <input
            onChange={handleChange}
            type="text"
            id="OrderNumber"
            className="bg-[#68C5DB] border border-[#02182b] text-gray-900 text-sm rounded-lg focus:ring-[blue-500] focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:[ring-blue-500] dark:focus:border-blue-500"
            placeholder="Order Number"
            required
            name="OrderNumber"
          />
          <input
            onChange={handleChange}
            id="Amount"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Amount ~ must be a number"
            required
            type="Number"
            name="Amount"
          />
          <select
            onChange={handleChange}
            id="rfr"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Reason For Refund"
            required
            type="text"
            name="ReasonForRefund"
          >
            <option selected disabled value={""}>
              Reason for Refund
            </option>
            <option id="RP">Returned Parts</option>
            <option id="DF">Defective Parts</option>
            <option id="miss">Missing Parts</option>
            <option id="lost">Package Lost In Transit </option>
            <option id="Discount">Discount On The Order</option>
            <option id="Cancel">Cancellation</option>
            <option id="OOS">Out Of Stock!</option>
            <option id="SF">Shipping Fees</option>
            <option id="PD">Price Difference</option>
          </select>
          <select
            onChange={handleChange}
            id="reason for discount"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Reason For Discount if Discounted"
            type="text"
            name="RFD"
          >
            <option disabled selected value={""}>
              Reason for Discount
            </option>
            <option id="SS">Save The Sale</option>
            <option id="MP">Missing Parts</option>
            <option id="MH">Missing Hardware</option>
            <option id="Del">Delay</option>
          </select>
          <input
            onChange={handleChange}
            id="Tracking"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Tracking number if returned"
            type="text"
            name="tracking"
          />
          <select
            onChange={handleChange}
            id="Platform"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Platform"
            type="text"
            name="platform"
            required
          >
            <option selected disabled value={""}>
              Platform
            </option>
            <option id="eBay">eBay</option>
            <option id="amz">Amazon</option>
            <option id="Woo">WooCommerce</option>
          </select>
          <input
            onChange={handleChange}
            id="Description"
            className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Description"
            type="text"
            name="Description"
          />

          <button
            type="submit"
            className="bg-[#02182b] text-[#68C5DB] p-3 rounded-lg"
          >
            Submit
          </button>
          {/* {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )} */}
        </form>
      </div>
    </div>
  );
}
