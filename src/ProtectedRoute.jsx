import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { base_url } from "./baseUrl";
import Loader from "./components/frontend/Loader";
import { saveFcmToken } from "./services/globalFunction";
import { logout } from "./redux/features/authSlice";
import { useDispatch } from "react-redux";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [searchParam] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    const validateToken = async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      const userId = JSON.parse(localStorage.getItem("userId"));

      if (!token || !userId) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await axios.get(
          `${base_url}/get-user/${userId}`,
          {
            headers: { Token: token }
          }
        );
        if (res?.data.success) {
          console.log(res.data.user.status, res.data.user?.status !== "active")
          if (res.data.user?.status !== "active") {
            dispatch(logout())
            localStorage.clear();
            sessionStorage.clear();

            setIsAuthenticated(false);

            toast.error(`Your account is ${res?.data?.user?.status}`);

            return; // 🔥 stop further execution
          }
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid token");
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        if (!toast.isActive("token-expired")) {
          toast.error("Session expired. Please log in again.", {
            toastId: "token-expired",
          });
        }

        setIsAuthenticated(false);
      }
    };

    const init = async () => {
      const userIdFromQuery = searchParam.get("user");
      const tokenFromQuery = searchParam.get("token");

      // ✅ Google login case
      if (userIdFromQuery && tokenFromQuery) {
        localStorage.setItem("userId", JSON.stringify(userIdFromQuery));
        localStorage.setItem("token", JSON.stringify(tokenFromQuery));

        // 👉 validate first
        await validateToken();

        // 👉 FCM token save
        await saveFcmToken();

        // 👉 redirect only once
        navigate("/trade", { replace: true });
      } else {
        // ✅ normal flow
        await validateToken();
      }
    };

    init();
  }, [searchParam, navigate]);

  // ⏳ loading state
  if (isAuthenticated === null) {
    return <Loader />;
  }

  // 🔐 protected
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;