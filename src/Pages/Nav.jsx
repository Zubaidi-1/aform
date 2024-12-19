import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MainNav({ token }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [token]); // Updates when the token changes

  const handleClick = () => {
    localStorage.removeItem("authToken");
    setLoggedIn(false);
    navigate("/"); // Redirect to home after sign out
  };

  return (
    <>
      <div className="z-50 bg-[#02182B] flex justify-center items-center h-9 min-w-max ">
        <ul className="flex justify-center items-center w-max gap-8 text-[#68C5DB]">
          <Link>Price Match</Link>
          <Link to={"aform"}>Form</Link>
          <Link to={"pp"}>Push/pull</Link>
          <Link to={"refunds"}>Refunds</Link>
          <Link to={"WE"}>Warehouse Error</Link>
          <Link to={"listing"}>Listings</Link>
          <Link to={"DEF"}>DEF</Link>
          <Link to={"ref"}>REF</Link>
          <Link to={"SS"}>Saved Sale</Link>
          <Link to={"SPA"}>Taco Speakers</Link>
          <Link to={"CC"}>Contact Customers</Link>
          <Link to={"pwdc"}>Parts We Don’t Carry</Link>
          <Link to={"userControl"}>Slave Control</Link>

          {loggedIn && (
            <button onClick={handleClick}>
              <Link to={"/"}>Sign Out</Link>
            </button>
          )}
        </ul>
      </div>
      <Outlet />
    </>
  );
}
