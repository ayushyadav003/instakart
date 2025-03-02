import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Login from '../pages/login/Login'
import LoginLayout from '../layouts/LoginLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import Signup from '../pages/login/Signup'
import ForgetPassword from '../pages/login/ForgetPassword'
import ResetPassword from '../pages/login/ResetPasswrod'

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
            <LoginLayout>
              <Signup />
            </LoginLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
