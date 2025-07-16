import "antd/dist/reset.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd"; // ✅
import App from "./App.jsx";
import { store } from "./store/store.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#006666", // ✅ optional
        },
      }}
    >
      <AntdApp>
        {" "}
        {/* ✅ this MUST wrap the React tree */}
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </AntdApp>
    </ConfigProvider>
  </React.StrictMode>
);
