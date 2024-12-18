import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainNav from "./Pages/Nav";
import HomePage from "./Pages/Home";
import Login from "./Pages/Login";
import SignUpPage from "./Pages/SignUp";
import Aform from "./Pages/Aform";
import Forms from "./Pages/Forms";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import RefundsForm from "./Pages/RefundForm";
import User from "./Pages/User";
import PP from "./Pages/PP";
import WE from "./Pages/WH";
import Lost from "./Pages/Lost";
import Listing from "./Pages/Listing";
import Ref from "./Pages/REF";
import PWDC from "./Pages/PWDC";
import Saved from "./Pages/Saved";
import SPA from "./Pages/SPA";
import Contact from "./Pages/Contact";
import DEF from "./Pages/DEF";

function App() {
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000; // Current time in seconds
          if (decodedToken.exp < currentTime) {
            console.log("Token has expired.");
            localStorage.removeItem("authToken"); // Remove expired token
            window.location.href = "/aform/login"; // Redirect to login page
          } else {
            console.log("Token is valid:", decodedToken);
          }
        } catch (err) {
          console.error("Error decoding token:", err.message);
          localStorage.removeItem("authToken"); // Cleanup in case of invalid token
          window.location.href = "/aform/login"; // Redirect to login page
        }
      }
    };

    // Check token expiry immediately when the component is mounted
    checkTokenExpiry();

    // Set an interval to check token expiry every minute (60000 ms)
    const interval = setInterval(checkTokenExpiry, 60000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []); // Run on mount

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainNav />,
      children: [
        { path: "/", element: <Login /> },
        { path: "/signup", element: <SignUpPage /> },
        { path: "/aform", element: <Aform /> },
        { path: "/aform/:form", element: <Forms /> },
        { path: "/userControl", element: <User /> },
        { path: "/refunds", element: <RefundsForm /> },
        { path: "/pp", element: <PP /> },
        { path: "/we", element: <WE /> },
        { path: "/lost", element: <Lost /> },
        { path: "/listing", element: <Listing /> },
        { path: "/ref", element: <Ref /> },
        { path: "/pwdc", element: <PWDC /> },
        { path: "/SS", element: <Saved /> },
        { path: "/SPA", element: <SPA /> },
        { path: "/CC", element: <Contact /> },
        { path: "/DEF", element: <DEF /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
