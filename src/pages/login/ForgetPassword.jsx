import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import "./login.scss";
import * as Yup from "yup";
import { apiConfig } from "../../services/ApiConfig";
import { ApiWithToken } from "../../services/ApiWithToken";
import { useFormik } from "formik";
import { ApiWithOutToken } from "../../services/ApiWithoutToken";
import { Email } from "@mui/icons-material";

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const validateSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("This field is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validateSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const apiOptions = {
        url: `${apiConfig.forgetPassword}?email=${email}`,
        method: "POST",
      };
      const response = await ApiWithOutToken(apiOptions);
      if (response?.status === 200) {
        toast.success("Reset Password link sent to your mail.");
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginForm">
      {/* <img src="/images/icons/logo.jpg" alt="logo" height={100} /> */}
      <div className="forgetInner">
        <form onSubmit={handleSubmit}>
          <div>
            <h2>Forget Password</h2>
            <p>Please enter your registered email address.</p>
          </div>
          <TextField
            placeholder="Email"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "14px", // Reduce the font size by 1px
                "& fieldset": {
                  borderColor: "#cde2e7", // Change the border color
                },
              },
            }}
            value={email}
            margin="normal"
            style={{ marginTop: "1rem" }}
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant="contained"
            className="loginBtn"
            type="submit"
            style={{ marginTop: "2rem" }}
            disabled={loading}
          >
            Submit
            {loading && (
              <CircularProgress size={30} style={{ marginLeft: "1rem" }} />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
