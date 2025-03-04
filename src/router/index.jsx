import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Login from '../pages/login/Login'
import LoginLayout from '../layouts/LoginLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import Signup from '../pages/login/Signup'
import ForgetPassword from '../pages/login/ForgetPassword'
import ResetPassword from '../pages/login/ResetPasswrod'
import Dashboard from '../pages/dashboard/Dashboard'
import Products from '../pages/products/Products'
import ThemeListing from '../pages/themes/Themes'
import CollectionPage from '../components/collection/Collections'
import StoreLayout from '../layouts/store/StoreLayout'
import ProductPage from '../components/productPage/ProductPage'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LoginLayout>
              <Login />

              {/* <UnderMaintenance /> */}
            </LoginLayout>
          }
        />
        {/* <Route
          path="/team-login"
          element={
            <LoginLayout>
              <Login />
            </LoginLayout>
          }
        /> */}
        <Route
          path="/forget-password"
          element={
            <LoginLayout>
              <ForgetPassword />
            </LoginLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <LoginLayout>
              <ResetPassword />
            </LoginLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <LoginLayout>
              <Signup />
            </LoginLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/products"
          element={
            <DashboardLayout>
              <Products />
            </DashboardLayout>
          }
        />
        <Route
          path="/themes"
          element={
            <DashboardLayout>
              <ThemeListing />
            </DashboardLayout>
          }
        />
        <Route
          path="/:id/collection"
          element={
            <StoreLayout>
              <CollectionPage />
            </StoreLayout>
          }
        />
        <Route
          path="/:storeId/:productId"
          element={
            <StoreLayout>
              <ProductPage />
            </StoreLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
