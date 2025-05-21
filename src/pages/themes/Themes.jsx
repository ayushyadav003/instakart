import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiWithToken } from "../../services/ApiWithToken";
import { apiConfig } from "../../services/ApiConfig";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Theme.scss";
import axios from "axios";

const AddTheme = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      banners: [],
      colors: {
        primary: "#000000", // Default primary color
        secondary: "#FFFFFF", // Default secondary color
        navbarColor: "#000000", // Default navbar color
        footerColor: "#FFFFFF", // Default footer color
        primaryBtnColor: "#000000", // Default primary button color
        secondaryBtnColor: "#FFFFFF", // Default secondary button color
        primaryTextColor: "#000000", // Default primary text color
        secondaryTextColor: "#FFFFFF", // Default secondary text color
      },
    },
    validationSchema: Yup.object({
      banners: Yup.array()
        .min(1, "At least one banner is required")
        .required("Banners are required"),
      colors: Yup.object({
        primary: Yup.string().required("Primary color is required"),
        secondary: Yup.string().required("Secondary color is required"),
        navbarColor: Yup.string().required("Navbar color is required"),
        footerColor: Yup.string().required("Footer color is required"),
        primaryBtnColor: Yup.string().required(
          "Primary button color is required"
        ),
        secondaryBtnColor: Yup.string().required(
          "Secondary button color is required"
        ),
        primaryTextColor: Yup.string().required(
          "Primary text color is required"
        ),
        secondaryTextColor: Yup.string().required(
          "Secondary text color is required"
        ),
      }),
    }),
    onSubmit: async (values) => {
      try {
        const uploadedBanners = await Promise.all(
          values.banners.map(async (file) => {
            if (typeof file === "string") return file; // Skip upload for existing banners
            const uploadData = new FormData();
            uploadData.append("file", file, file.name);
            uploadData.append("upload_preset", "instakart");
            const { data: cloudinaryResponse } = await axios.post(
              "https://api.cloudinary.com/v1_1/dobzi0uvb/image/upload",
              uploadData
            );
            return cloudinaryResponse.secure_url;
          })
        );

        const themeData = {
          banners: uploadedBanners,
          colors: values.colors,
        };

        const response = await ApiWithToken({
          url: apiConfig.createOrUpdateTheme,
          method: "POST",
          data: themeData,
        });

        if (response.status >= 200 && response.status < 300) {
          toast.success("Theme saved successfully!");
          navigate("/themes");
        } else {
          toast.error("Failed to save theme. Please try again.");
        }
      } catch (error) {
        console.error("Error saving theme:", error);
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  // Fetch theme data on component mount
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await ApiWithToken({
          url: `${apiConfig.getTheme}/${
            JSON.parse(localStorage.getItem("instakart-user-details")).userId
          }`,
          method: "GET",
        });

        if (response.status === 200 && response.data) {
          const themeData = response.data;
          formik.setValues({
            banners: themeData.banners || [],
            colors: {
              primary: themeData.colors?.primary || "#000000",
              secondary: themeData.colors?.secondary || "#FFFFFF",
              navbarColor: themeData.colors?.navbarColor || "#000000",
              footerColor: themeData.colors?.footerColor || "#FFFFFF",
              primaryBtnColor: themeData.colors?.primaryBtnColor || "#000000",
              secondaryBtnColor:
                themeData.colors?.secondaryBtnColor || "#FFFFFF",
              primaryTextColor: themeData.colors?.primaryTextColor || "#000000",
              secondaryTextColor:
                themeData.colors?.secondaryTextColor || "#FFFFFF",
            },
          });
        } else {
          toast.info("No theme data found. You can create a new theme.");
        }
      } catch (error) {
        console.error("Error fetching theme:", error);
        toast.error("Failed to fetch theme data. Please try again.");
      }
    };

    fetchTheme();
  }, []);

  const handleBannerUpload = ({ target: { files } }) => {
    formik.setFieldValue("banners", [
      ...formik.values.banners,
      ...Array.from(files),
    ]);
  };

  const removeBanner = (bannerToRemove) => {
    formik.setFieldValue(
      "banners",
      formik.values.banners.filter((banner) => banner !== bannerToRemove)
    );
  };

  return (
    <div className="add-theme-container">
      <ToastContainer limit={1} position="bottom-right" autoClose={3000} />
      <div className="header-container">
        <Link to="/themes">
          <ArrowBackIcon />
        </Link>
        <h2>Add or Update Theme</h2>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label>Primary Color</label>
          <input
            type="color"
            name="primary"
            value={formik.values.colors.primary}
            onChange={(e) =>
              formik.setFieldValue("colors.primary", e.target.value)
            }
          />
          {formik.touched.colors?.primary && formik.errors.colors?.primary && (
            <div className="error">{formik.errors.colors.primary}</div>
          )}
        </div>
        <div className="form-group">
          <label>Secondary Color</label>
          <input
            type="color"
            name="secondary"
            value={formik.values.colors.secondary}
            onChange={(e) =>
              formik.setFieldValue("colors.secondary", e.target.value)
            }
          />
          {formik.touched.colors?.secondary &&
            formik.errors.colors?.secondary && (
              <div className="error">{formik.errors.colors.secondary}</div>
            )}
        </div>
        <div className="form-group">
          <label>Navbar Color</label>
          <input
            type="color"
            name="navbarColor"
            value={formik.values.colors.navbarColor}
            onChange={(e) =>
              formik.setFieldValue("colors.navbarColor", e.target.value)
            }
          />
          {formik.touched.colors?.navbarColor &&
            formik.errors.colors?.navbarColor && (
              <div className="error">{formik.errors.colors.navbarColor}</div>
            )}
        </div>
        <div className="form-group">
          <label>Footer Color</label>
          <input
            type="color"
            name="footerColor"
            value={formik.values.colors.footerColor}
            onChange={(e) =>
              formik.setFieldValue("colors.footerColor", e.target.value)
            }
          />
          {formik.touched.colors?.footerColor &&
            formik.errors.colors?.footerColor && (
              <div className="error">{formik.errors.colors.footerColor}</div>
            )}
        </div>
        <div className="form-group">
          <label>Primary Button Color</label>
          <input
            type="color"
            name="primaryBtnColor"
            value={formik.values.colors.primaryBtnColor}
            onChange={(e) =>
              formik.setFieldValue("colors.primaryBtnColor", e.target.value)
            }
          />
          {formik.touched.colors?.primaryBtnColor &&
            formik.errors.colors?.primaryBtnColor && (
              <div className="error">
                {formik.errors.colors.primaryBtnColor}
              </div>
            )}
        </div>
        <div className="form-group">
          <label>Secondary Button Color</label>
          <input
            type="color"
            name="secondaryBtnColor"
            value={formik.values.colors.secondaryBtnColor}
            onChange={(e) =>
              formik.setFieldValue("colors.secondaryBtnColor", e.target.value)
            }
          />
          {formik.touched.colors?.secondaryBtnColor &&
            formik.errors.colors?.secondaryBtnColor && (
              <div className="error">
                {formik.errors.colors.secondaryBtnColor}
              </div>
            )}
        </div>
        <div className="form-group">
          <label>Primary Text Color</label>
          <input
            type="color"
            name="primaryTextColor"
            value={formik.values.colors.primaryTextColor}
            onChange={(e) =>
              formik.setFieldValue("colors.primaryTextColor", e.target.value)
            }
          />
          {formik.touched.colors?.primaryTextColor &&
            formik.errors.colors?.primaryTextColor && (
              <div className="error">
                {formik.errors.colors.primaryTextColor}
              </div>
            )}
        </div>
        <div className="form-group">
          <label>Secondary Text Color</label>
          <input
            type="color"
            name="secondaryTextColor"
            value={formik.values.colors.secondaryTextColor}
            onChange={(e) =>
              formik.setFieldValue("colors.secondaryTextColor", e.target.value)
            }
          />
          {formik.touched.colors?.secondaryTextColor &&
            formik.errors.colors?.secondaryTextColor && (
              <div className="error">
                {formik.errors.colors.secondaryTextColor}
              </div>
            )}
        </div>
        <div className="form-group">
          <label>Banners</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleBannerUpload}
          />
          {formik.touched.banners && formik.errors.banners && (
            <div className="error">{formik.errors.banners}</div>
          )}
          <div className="banner-preview">
            {formik.values.banners.map((banner, index) => (
              <div key={index} className="banner-item">
                <img
                  src={
                    typeof banner === "string"
                      ? banner
                      : URL.createObjectURL(banner)
                  }
                  alt={`Banner ${index + 1}`}
                  className="banner-image"
                />
                <button
                  type="button"
                  className="remove-banner"
                  onClick={() => removeBanner(banner)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="add-button">
          Save Theme
        </button>
      </form>
    </div>
  );
};

export default AddTheme;
