// import Layout from "./components/Layout";

// export default function App() {
//   return (
//     <Layout>
//       <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
//       <p className="mt-2 text-gray-600">
//         This content is passed as children into the Layout component.
//       </p>
//     </Layout>
//   );
// }
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import ProtectedLayout from "./components/ProtectedLayout";
import Dashbord from "./pages/home/dashbord";
import AppInitializer from "./components/AppInitializer";
import VersionCheck from "./components/VersionCheck";
import ForgotPassword from "./pages/auth/ForgotPassword";
import UserForm from "./components/user/UserForm";

function App() {
  return (
    <AppInitializer>
      <VersionCheck />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgotPassword />} />

        {/* Protected Routes: All other paths */}
        <Route
          path="*"
          element={
            <ProtectedLayout>
              <Routes>
                <Route path="/home" element={<Dashbord />} />
                <Route path="/user-form" element={<UserForm />} />
                {/* Add more protected routes here */}
              </Routes>
            </ProtectedLayout>
          }
        />
      </Routes>
    </AppInitializer>
  );
}
export default App;
