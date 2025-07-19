// // import { DOT_ENV, PANEL_CHECK } from "@/api";
// // import { logout } from "@/redux/slices/AuthSlice";
// // import { setShowUpdateDialog } from "@/redux/slices/versionSlice";
// import { App } from "antd";
// import CryptoJS from "crypto-js";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { DOT_ENV, PANEL_CHECK } from "../api";
// import usetoken from "../api/usetoken";
// import { useApiMutation } from "../hooks/useApiMutation";
// import { logout } from "../store/auth/authSlice";
// import { setShowUpdateDialog } from "../store/auth/versionSlice";
// import { persistor } from "../store/store";

// const secretKey = import.meta.env.VITE_SECRET_KEY;
// const validationKey = import.meta.env.VITE_SECRET_VALIDATION;

// const AppInitializer = ({ children }) => {
//   const { trigger } = useApiMutation();
//   const { message } = App.useApp();
//   const token = usetoken();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const localVersion = useSelector((state) => state.auth?.version);

//   useEffect(() => {
//     const validateEnvironment = async () => {
//       try {
//         if (!secretKey) {
//           navigate("/maintenance");
//           throw new Error("Missing SECRET_KEY");
//         }

//         const statusRes = await trigger({ url: PANEL_CHECK });
//         if (statusRes?.message !== "Success") {
//           throw new Error("Panel status check failed");
//         }

//         const serverVer = statusRes?.version?.version_panel;

//         if (token) {
//           dispatch(
//             setShowUpdateDialog({
//               showUpdateDialog: localVersion !== serverVer,
//               version: serverVer,
//             })
//           );
//         }

//         const dotenvRes = await trigger({ url: DOT_ENV });

//         const dynamicValidationKey = dotenvRes?.data;

//         if (!dynamicValidationKey) {
//           throw new Error("Validation key missing");
//         }

//         const computedHash = validationKey
//           ? CryptoJS.MD5(validationKey).toString()
//           : "";

//         if (!secretKey || computedHash !== dynamicValidationKey) {
//           throw new Error("Invalid environment config");
//         }

//         if (location.pathname == "/maintenance") {
//           navigate("/");
//         }
//       } catch (error) {
//         console.error("❌ App Initialization Error:", error.message);

//         await persistor.flush();
//         localStorage.clear();
//         dispatch(logout());
//         setTimeout(() => persistor.purge(), 1000);

//         message.error(error.message || "Environment Error");

//         if (location.pathname !== "/maintenance") {
//           navigate("/maintenance");
//         }
//       }
//     };

//     validateEnvironment();
//   }, [navigate, dispatch]);

//   return children;
// };

// export default AppInitializer;
import { App } from "antd";
import CryptoJS from "crypto-js";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { DOT_ENV, PANEL_CHECK } from "../api";
import usetoken from "../api/usetoken";
import { useApiMutation } from "../hooks/useApiMutation";
import { logout } from "../store/auth/authSlice";
import { setShowUpdateDialog } from "../store/auth/versionSlice";
import { persistor } from "../store/store";

const secretKey = import.meta.env.VITE_SECRET_KEY;
const validationKey = import.meta.env.VITE_SECRET_VALIDATION;

const AppInitializer = ({ children }) => {
  const { trigger } = useApiMutation();
  const { message } = App.useApp();
  const token = usetoken();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const localVersion = useSelector((state) => state.auth?.version);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return; // ✅ Prevent repeat execution
    hasInitialized.current = true;

    const validateEnvironment = async () => {
      try {
        // 🔒 Check required env
        if (!secretKey || !validationKey) {
          throw new Error("Missing environment configuration");
        }

        // 🛡️ Backend Status Check
        const statusRes = await trigger({ url: PANEL_CHECK });
        if (statusRes?.message !== "Success") {
          throw new Error("Panel status check failed");
        }

        // 🔄 Version Match
        const serverVer = statusRes?.version?.version_panel;
        if (token) {
          dispatch(
            setShowUpdateDialog({
              showUpdateDialog: localVersion !== serverVer,
              version: serverVer,
            })
          );
        }

        // 🔐 Validate Secret Key
        const dotenvRes = await trigger({ url: DOT_ENV });
        const dynamicValidationKey = dotenvRes?.data;
        const computedHash = CryptoJS.MD5(validationKey).toString();

        if (!dynamicValidationKey || computedHash !== dynamicValidationKey) {
          throw new Error("Invalid environment config");
        }

        // 🏁 If on /maintenance and all is good, redirect to root
        if (location.pathname === "/maintenance") {
          navigate("/");
        }
      } catch (error) {
        console.error("❌ App Initialization Error:", error.message);

        // 🧹 Cleanup and redirect to /maintenance
        await persistor.flush();
        localStorage.clear();
        dispatch(logout());
        setTimeout(() => persistor.purge(), 1000);

        message.error(error.message || "Environment Error");

        if (location.pathname !== "/maintenance") {
          navigate("/maintenance");
        }
      }
    };

    validateEnvironment();
  }, []); // ✅ Empty deps – run once

  return children;
};

export default AppInitializer;
