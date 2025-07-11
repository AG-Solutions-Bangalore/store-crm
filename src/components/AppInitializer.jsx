// import { DOT_ENV, PANEL_CHECK } from "@/api";
// import { logout } from "@/redux/slices/AuthSlice";
// import { setShowUpdateDialog } from "@/redux/slices/versionSlice";
import CryptoJS from "crypto-js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { DOT_ENV, PANEL_CHECK } from "../api";
import usetoken from "../api/usetoken";
import { useApiMutation } from "../hooks/useApiMutation";
import { logout } from "../store/auth/authSlice";
import { persistor } from "../store/store";
import toast from "react-hot-toast";
import { setShowUpdateDialog } from "../store/auth/versionSlice";
import useLogout from "../hooks/useLogout";

const secretKey = import.meta.env.VITE_SECRET_KEY;
const validationKey = import.meta.env.VITE_SECRET_VALIDATION;

const AppInitializer = ({ children }) => {
  const { trigger, loading } = useApiMutation();

  const token = usetoken();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const localVersion = useSelector((state) => state.auth?.version);

  useEffect(() => {
    const validateEnvironment = async () => {
      try {
        if (!secretKey) {
          navigate("/maintenance");
          throw new Error("Missing SECRET_KEY");
        }

        const statusRes = await trigger({ url: PANEL_CHECK });
        if (statusRes?.message !== "Success") {
          throw new Error("Panel status check failed");
        }

        const serverVer = statusRes?.version?.version_panel;

        if (token) {
          dispatch(
            setShowUpdateDialog({
              showUpdateDialog: localVersion !== serverVer,
              version: serverVer,
            })
          );
        }

        const dotenvRes = await trigger({ url: DOT_ENV });

        const dynamicValidationKey = dotenvRes?.data;

        if (!dynamicValidationKey) {
          throw new Error("Validation key missing");
        }

        const computedHash = validationKey
          ? CryptoJS.MD5(validationKey).toString()
          : "";

        if (!secretKey || computedHash !== dynamicValidationKey) {
          throw new Error("Invalid environment config");
        }

        if (location.pathname == "/maintenance") {
          navigate("/");
        }
      } catch (error) {
        console.error("❌ App Initialization Error:", error.message);

        await persistor.flush();
        localStorage.clear();
        dispatch(logout());
        setTimeout(() => persistor.purge(), 1000);

        toast.error(error.message || "Environment Error");

        if (location.pathname !== "/maintenance") {
          navigate("/maintenance");
        }
      }
    };

    validateEnvironment();
  }, [navigate, dispatch]);

  return children;
};

export default AppInitializer;
