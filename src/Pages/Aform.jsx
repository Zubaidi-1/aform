import { useNavigate } from "react-router-dom";
import useAuth from "../../Components/auth";
export default function Aform() {
  const token = localStorage.getItem("authToken");

  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#02182b]">
      <div className="flex justify-center items-center min-h-screen">
        {/* Background blur container */}
        <div className="absolute inset-0 bg-[#6f8eae]/70 backdrop-blur-md"></div>
        <div className="relative z-10 flex justify-center items-center flex-grow">
          <form className="flex flex-col justify-center items-center gap-2">
            <label htmlFor="Requests" className=" text-[#02182b]">
              Select A Request
            </label>
            <div>
              <select
                className="rounded-full p-2 bg-[#02182b] text-[#6f8eae] border border-[#02182b]  text-center focus:outline-none focus:border-[#02182b] focus:border"
                name="Requests"
                id="Requests"
                required
              >
                <option value="Refunds">Refunds</option>
                <option value="P&P">Push & Pull</option>
                <option value="WE">Warehouse Error</option>
                <option value="Lost">Lost / Damaged Packages / DBNR</option>
                <option value="LE">Listing Error</option>
                <option value="REF">REF Orders</option>
                <option value="DEF">Defective Parts</option>
                <option value="PWDC">Parts We do not carry</option>
                <option value="SS">Saved Sales</option>
                <option value="SPA">Spanish Speakers call backs</option>
                <option value="CC">Contact Customer</option>
              </select>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                navigate(`/aform/${document.getElementById("Requests").value}`);
              }}
              className="bg-[#02182b] text-[#6f8eae] p-2 rounded-lg "
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
