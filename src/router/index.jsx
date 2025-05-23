import { Routes, Route, BrowserRouter } from 'react-router-dom'
import ThemeListing from '../pages/themes/Themes'
import CollectionPage from '../components/collection/Collections'
import StoreLayout from '../layouts/store/StoreLayout'
import ProductPage from '../components/collection/productPage/ProductPage'
import Login from '../pages/login/Login'
import LoginLayout from '../layouts/LoginLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import Signup from '../pages/login/Signup'
import ForgetPassword from '../pages/login/ForgetPassword'
import ResetPassword from '../pages/login/ResetPasswrod'
import Dashboard from '../pages/dashboard/Dashboard'
import ProductList from '../pages/products/ProductList'
import AddProduct from '../pages/products/AddProduct'
import OrderList from '../pages/orders/OrderList'
import AddOrder from '../pages/orders/AddOrder'
import AddVariant from '../pages/variants/AddVariant'
import Analytics from '../pages/analytics/Analytics'
import Profile from '../pages/profile/Profile'
import { ProfileProvider } from '../context/ProfileContext'
import Transactions from '../pages/transactions/Transactions'
import Admin from '../pages/admin/Admin'
import UserProfile from '../pages/admin/UserProfile'
import DiscountList from '../pages/discounts/DiscountList'
import AddDiscount from '../pages/discounts/AddDiscount'
import AddTheme from '../pages/themes/Themes'

export default function Router() {
  return (
    <ProfileProvider>
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
                <Admin />
            }
          />
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
          {/* <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          /> */}
          <Route
            path="/orders"
            element={
              <DashboardLayout>
                <OrderList />
              </DashboardLayout>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <DashboardLayout>
                <AddOrder />
              </DashboardLayout>
            }
          />
          <Route
            path="/add-order"
            element={
              <DashboardLayout>
                <AddOrder />
              </DashboardLayout>
            }
          />
          <Route
            path="/products"
            element={
              <DashboardLayout>
                <ProductList />
              </DashboardLayout>
            }
          />

          <Route
            path="/add-product"
            element={
              <DashboardLayout>
                <AddProduct />
              </DashboardLayout>
            }
          />
          <Route
            path="/add-variant/:productId"
            element={
              <DashboardLayout>
                <AddVariant />
              </DashboardLayout>
            }
          />
          <Route
            path="/variants/:productId/:variantId"
            element={
              <DashboardLayout>
                <AddVariant />
              </DashboardLayout>
            }
          />
          <Route
            path="/product/:productId"
            element={
              <DashboardLayout>
                <AddProduct />
              </DashboardLayout>
            }
          />
          <Route
            path="/discounts"
            element={
              <DashboardLayout>
                <DiscountList />
              </DashboardLayout>
            }
          />
          <Route
            path="/discount/admin/:discountId"
            element={
              <DashboardLayout>
                <AddDiscount />
              </DashboardLayout>
            }
          />
            <Route
            path="/add-discount"
            element={
              <DashboardLayout>
                <AddDiscount />
              </DashboardLayout>
            }
          />
          <Route
            path="/themes"
            element={
              <DashboardLayout>
                <AddTheme/>
              </DashboardLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            }
          />
           <Route
            path="/admin/dashboard"
            element={
                <Admin />
            }
            
          />
            <Route
            path="/admin/userProfile/:userId"
            element={
                <UserProfile />
            }
            
          />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            }
          />
          <Route
            path="/transactions/:id"
            element={
              <DashboardLayout>
                <Transactions />
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
    </ProfileProvider>
  )
}
