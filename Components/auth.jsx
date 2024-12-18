import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   if (!token) {
  //     navigate("/");
  //     return;
  //   }
  //   const decodedToken = jwtDecode(token);
  //   const currentTime = Date.now() / 1000; // Current time in seconds
  //   if (decodedToken.exp < currentTime) {
  //     localStorage.removeItem("authToken");
  //     navigate("/login");
  //   }
  // }, [navigate]);
};

export default useAuth;
