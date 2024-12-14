import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
export default function MainNav() {
  const [loggedIn, setLoggedIn] = useState(true);
  const token = localStorage.getItem("authToken");
  console.log(token);

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn]);
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
