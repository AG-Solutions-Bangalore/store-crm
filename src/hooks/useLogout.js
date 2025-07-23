import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "./useApiMutation";
import { PANEL_LOGOUT } from "../api";
import usetoken from "../api/usetoken";
import { logout } from "../store/auth/authSlice";
import { persistor } from "../store/store";
import { App } from "antd";

const useLogout = () => {
  const { message } = App.useApp();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = usetoken();
  const { trigger } = useApiMutation();

  const handleLogout = async () => {
    try {
      await trigger({
        url: PANEL_LOGOUT,
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await persistor.flush();
      // localStorage.clear();
      dispatch(logout());

      navigate("/");
      setTimeout(() => persistor.purge(), 1000);
    } catch (error) {
      message.error(error?.response?.data?.message || "Logout Error");
    }
  };

  return handleLogout;
};

export default useLogout;
