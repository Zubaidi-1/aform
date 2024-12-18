import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decodedToken.exp < currentTime) {
          console.log("Token has expired.");
          localStorage.removeItem("authToken"); // Remove expired token
          window.location.href = "/aform/login"; // Redirect to login page
        }
      } catch (err) {
        console.error("Error decoding token:", err.message);
        localStorage.removeItem("authToken");
        window.location.href = "/aform/login";
      }
    }
  }, []);
};

export default useAuth;
