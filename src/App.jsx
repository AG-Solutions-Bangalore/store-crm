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
import { Route, Routes } from "react-router-dom";
import AppInitializer from "./components/AppInitializer";
import ProtectedLayout from "./components/ProtectedLayout";
import VersionCheck from "./components/VersionCheck";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SignIn from "./pages/auth/SignIn";
import Dashbord from "./pages/home/dashbord";
import UserPage from "./pages/profile/Profile";
import UserForm from "./pages/user/UserForm";
import CategoryList from "./pages/category/CategoryList";
import UserList from "./pages/user/UserList";
import ProductList from "./pages/product/ProductList";
import ProductForm from "./pages/product/ProductForm";

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
                <Route path="/user-form" element={<UserPage />} />
                <Route path="/user" element={<UserList />} />
                <Route path="/user-create" element={<UserForm />} />
                <Route path="/user-edit/:id" element={<UserForm />} />
                <Route path="/category" element={<CategoryList />} />
                <Route path="/product" element={<ProductList />} />
                <Route path="/product-create" element={<ProductForm />} />
                <Route path="/product-edit/:id" element={<ProductForm />} />

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
