import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MainNav() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []); // Empty dependency array to run only once on mount

  const handleClick = () => {
    localStorage.removeItem("authToken");
    setLoggedIn(false);
  };

  return (
    <>
      <div className="z-50 bg-[#02182B] flex justify-center items-center h-9 min-w-max ">
        <ul className="flex justify-center items-center w-max gap-8 text-[#68C5DB]">
          <Link>Price Match</Link>
          <Link to={"aform"}>Form</Link>
          <Link to={"pp"}>Push/pull</Link>
          <Link to={"refunds"}>refunds</Link>
          <Link to={"WE"}>warehouse error</Link>
          <Link to={"listing"}>Listings</Link>
          <Link to={"DEF"}>DEF</Link>
          <Link to={"ref"}>REF</Link>
          <Link to={"SS"}>Saved Sale</Link>
          <Link to={"SPA"}>taco speakers</Link>
          <Link to={"CC"}>Contact Customers</Link>
          <Link to={"pwdc"}>parts we dont carry</Link>
          <Link to={"userControl"}>Slave control</Link>

          {loggedIn ? (
            <button onClick={handleClick}>
              <Link to={"/"}> Sign Out </Link>
            </button>
          ) : null}
        </ul>
      </div>
      <Outlet />
    </>
  );
}
