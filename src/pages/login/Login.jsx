import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  TextField,
} from "@mui/material";
import Cookies from "js-cookie";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import "./login.scss";
import { apiConfig } from "../../services/ApiConfig";
import { useFormik } from "formik";
import axios from "axios";
import { ProfileContext } from "../../context/ProfileContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setProfilePicture } = useContext(ProfileContext);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  const validateSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("This field is required"),
    password: Yup.string()
      .required("This field is required")
      .min(5, "Pasword must be 5 or more characters")
      .matches(/\d/, "Password should contain at least one number"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validateSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (values) => {
    setLoading(true);
    try {
      const apiOptions = {
        url: apiConfig.login,
        method: "POST",
        data: values,
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios(apiOptions);
      if (response?.status === 200) {
        const resData = response?.data;
        console.log(resData, "resData");
        localStorage.setItem("instakart-user-details", JSON.stringify(resData));

        if (rememberMe) {
          localStorage.setItem(
            "instakart-remember-user",
            JSON.stringify({
              email: values?.email,
              password: values?.password,
            })
          );
          Cookies.set(
            "instakart-remember-user",
            JSON.stringify({
              email: values?.email,
              password: values?.password,
            }),
            { expires: 90 }
          );
        }

        setProfilePicture(resData?.profilePicture);
        navigate("/dashboard");
        toast.success("Logged in Successfully");

        setLoading(false);
      } else {
        toast.error(response?.data?.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = Cookies.get("instakart-remember-user");
    if (user) {
      const parsedUser = JSON.parse(user);
      formik.setValues({
        email: parsedUser.email,
        password: parsedUser.password,
      });
    }
  }, []);

  return (
    <div className="loginForm">
      {/* <img src={'/images/icons/logo.jpg'} alt="logo" height={100} /> */}
      <form onSubmit={formik.handleSubmit}>
        <h2>Welcome to InstaKart!</h2>
        <TextField
          // label="Email"
          fullWidth
          margin="normal"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          placeholder="Enter your email address"
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px", // Reduce the font size by 1px
              "& fieldset": {
                borderColor: "#cde2e7", // Change the border color
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
          error={Boolean(formik.touched.email && formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          // label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          placeholder="Enter your password"
          name="password"
          margin="normal"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.password}
          error={Boolean(formik.touched.password && formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px", // Reduce the font size by 1px
              "& fieldset": {
                borderColor: "#cde2e7", // Change the border color
              },
            },
          }}
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
                  onClick={togglePasswordVisibility}
                >
                  {!showPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </InputAdornment>
            ),
          }}
        />
        <div className="remember">
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={handleRememberMe}
                sx={{ fontSize: "1px" }}
              />
            }
            label={<span style={{ fontSize: "13px" }}>Remember me</span>}
          />
          <Link to="/forget-password">Forgot your password?</Link>
        </div>
        <div className="remember" style={{ margin: "3rem  0 0 0" }}>
          <Button
            variant="contained"
            className="loginBtn"
            type="submit"
            disabled={loading}
          >
            Log in
            {loading && (
              <CircularProgress size={20} style={{ marginLeft: "1rem" }} />
            )}
          </Button>
          <p>
            Do not have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
