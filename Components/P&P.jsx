import { useState } from "react";
import { jwtDecode } from "jwt-decode";
export default function PP() {
  const [formData, setFormData] = useState({
    order: "",
    partNumber: "",
    reman: "",
    warehouse: "",
    pushpull: "",
    tracking: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("authToken");
  const handleChange = function (e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  let email;
  if (token) {
    let decodedtoken = jwtDecode(token);
    email = decodedtoken.email;
  }

  const handleSubmit = async function (e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/aform/P&P", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          order: formData.order,
          partNumber: formData.partNumber,
          reman: formData.reman,
          warehouse: formData.warehouse,
          pushpull: formData.pushpull,
          tracking: formData.tracking,
        }),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error("failed to fetch");
      }

      alert("form submitted!");

      window.location.href = "/aform";
    } catch (e) {
      setErrorMessage(e.message);
      console.log(e.message);
    }
  };
  return (
    <>
      {/* {errorMessage ? <p>{errorMessage}</p> : null} */}
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
              id="OrderNumber"
              className="bg-[#68C5DB] border border-[#02182b] text-gray-900 text-sm rounded-lg focus:ring-[blue-500] focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:[ring-blue-500] dark:focus:border-blue-500"
              placeholder="Order Number"
              required
              name="order"
              onChange={handleChange}
            />
            <input
              id="PN"
              className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Part Number"
              required
              type="text"
              name="partNumber"
              onChange={handleChange}
            />
            <select
              id="reman"
              className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              type="text"
              name="reman"
              onChange={handleChange}
            >
              <option disabled selected value={""}>
                Remanufactured? / Reman Calipers
              </option>
              <option id="Yes">Yes</option>
              <option id="No">No</option>
              <option id="reman">Reman Calipers</option>
            </select>
            <select
              id="warehouse"
              className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              required
              name="warehouse"
              onChange={handleChange}
            >
              <option disabled selected value={""}>
                Warehouse
              </option>
              <option id="DT">DAXDT</option>
              <option id="JZ">DAXJZ</option>
            </select>
            <select
              id="P/P"
              className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              required
              name="pushpull"
              onChange={handleChange}
            >
              <option disabled selected value={""}>
                Push / Pull
              </option>
              <option id="push">Push</option>
              <option id="pull">Pull</option>
            </select>
            <input
              id="Tracking"
              className="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Tracking number, leave it empty if no tracking."
              type="text"
              name="tracking"
              onChange={handleChange}
            />

            <button className="bg-[#02182b] text-[#68C5DB] p-3 rounded-lg">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
