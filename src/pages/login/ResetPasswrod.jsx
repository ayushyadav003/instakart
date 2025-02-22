import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import "./login.scss";
import * as Yup from "yup";
import { ApiWithToken } from "../../services/ApiWithToken";
import { apiConfig } from "../../services/ApiConfig";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import { ApiWithOutToken } from "../../services/ApiWithoutToken";

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const validateSchema = Yup.object().shape({
    password: Yup.string()
      .required("This field is required")
      .min(5, "Pasword must be 5 or more characters")
      .matches(/\d/, "Password should contain at least one number"),
    confirmPassword: Yup.string()
      .required("This field is required")
      .oneOf([Yup.ref("password")], "The passwords do not match"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validateSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (value) => {
    setLoading(true);
    try {
      const apiOptions = {
        url: apiConfig.resetPassword,
        method: "GET",
        params: {
          password: value?.password,
          token: location?.search.split("=")[1],
        },
      };
      const response = await ApiWithOutToken(apiOptions);
      if (response?.data?.statusCode === 200) {
        console.log(response);
        toast.success("Successfully reset the password.");
        navigate("/");
      } else if (response?.data?.statusCode === 404) {
        toast.error("This link has been expired.");
        navigate("/");
      }
    } catch (error) {
      toast.error("Error in saving user details");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (type) => {
    setShowPassword({ ...showPassword, [type]: !showPassword[type] });
  };

  return (
    <div className="loginForm">
      {/* <img src="/images/icons/logo.jpg" alt="logo" height={100} /> */}
      <form onSubmit={formik?.handleSubmit}>
        <h2>Please enter you new password.</h2>
        <div className="forgetInner">
          <TextField
            placeholder="Password"
            type={showPassword?.password ? "text" : "password"}
            fullWidth
            name="password"
            margin="normal"
            onChange={formik.handleChange}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "14px", // Reduce the font size by 1px
                "& fieldset": {
                  borderColor: "#cde2e7", // Change the border color
                },
              },
            }}
            error={Boolean(formik.touched.password && formik.errors.password)}
            helperText={formik.touched.password ? formik.errors.password : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => togglePasswordVisibility("password")}
                  >
                    {!showPassword?.password ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </span>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="Confirm Password"
            type={showPassword?.confirmPassword ? "text" : "password"}
            fullWidth
            name="confirmPassword"
            margin="normal"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "14px", // Reduce the font size by 1px
                "& fieldset": {
                  borderColor: "#cde2e7", // Change the border color
                },
              },
            }}
            error={Boolean(
              formik.touched.confirmPassword && formik.errors.confirmPassword
            )}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.confirmPassword
                ? formik.errors.confirmPassword
                : ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  >
                    {!showPassword?.confirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </span>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            className="loginBtn"
            type="submit"
            style={{ color: "#fff", marginTop: "2rem" }}
            disabled={loading}
          >
            Submit
            {loading && (
              <CircularProgress size={30} style={{ marginLeft: "1rem" }} />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
