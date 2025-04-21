import React, { useState, useEffect, useRef } from "react";
import "../../components/styles/Profile.scss";
import { apiConfig } from "../../services/ApiConfig";
import { ApiWithToken } from "../../services/ApiWithToken";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Documents from "./BankingInfo";

// Reusable Input Component
const ProfileInput = ({
  label,
  name,
  value,
  readOnly,
  onChange,
  error,
  touched,
  ...props
}) => {
  return (
    <div className="info-item">
      <span className="info-label">{label}</span>
      <input
        name={name}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        className={
          (readOnly ? "info-value info-readonly" : "info-value info-input") +
          (error && touched ? " error" : "")
        }
        {...props}
      />
      {error && touched && <div className="error-message">{error}</div>}
    </div>
  );
};

// Yup Validation Schema
const profileValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  businessName: Yup.string().required("Business Name is required"),
  country: Yup.string(),
  city: Yup.string(),
  postalCode: Yup.string(),
  taxId: Yup.string(),
});

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [tabState, setTabState] = useState("personalInfo");
  const initialValues = {
    username: "",
    email: "",
    profileImage: "",
    name: "",
    phone: "",
    businessName: "",
    country: "",
    city: "",
    postalCode: "",
    taxId: "",
  };

  const { handleSubmit, handleChange, values, errors, touched, setValues } =
    useFormik({
      initialValues,
      validationSchema: profileValidationSchema,
      onSubmit: async (formValues) => {
        handleSave(formValues);
      },
      enableReinitialize: false,
    });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiOptions = {
          url: `${apiConfig.profile}`,
          method: "GET",
        };
        const response = await ApiWithToken(apiOptions);

        const profileData = {
          username: response.data.fullName || "",
          email: response.data.email || "",
          name: response.data.fullName || "",
          phone: response.data.mobile || "",
          businessName: response.data.businessName || "",
          country: response.data.country || "",
          city: response.data.city || "",
          postalCode: response.data.postalCode || "",
          taxId: response.data.taxId || "",
          profileImage: response.data.profilePicture || "", // Provide default
        };

        setValues(profileData); // Initialize Formik values
      } catch (error) {
        console.error("Error fetching profile:", error);
        const errorData = {
          // Setting default values in case of error.
          username: "Error",
          email: "",
          name: "",
          phone: "",
          businessName: "",
          country: "",
          city: "",
          postalCode: "",
          taxId: "",
          profileImage: "",
        };
        setValues(errorData);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isEditing) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.preventDefault();
        event.returnValue = message; // Standard for most browsers
        return message; // For some older browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEditing]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const imageUrl = e.target.result;
          setValues((prev) => ({ ...prev, profileImage: imageUrl }));

          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "instakart");
          try {
            const cloudinaryResponse = await axios.post(
              "https://api.cloudinary.com/v1_1/dobzi0uvb/image/upload",
              formData
            );
            const cloudinaryImageUrl = cloudinaryResponse.data.secure_url;
            setValues((prev) => ({
              ...prev,
              profileImage: cloudinaryImageUrl,
            }));

            try {
              const apiOptions = {
                url: `${apiConfig.profile}`,
                method: "PUT",
                data: { profileImage: cloudinaryImageUrl },
              };
              await ApiWithToken(apiOptions);
              console.log("Profile image updated on backend");

              const storedUserDetails = localStorage.getItem(
                "instakart-user-details"
              );
              if (storedUserDetails) {
                const userDetails = JSON.parse(storedUserDetails);
                userDetails.profilePicture = cloudinaryImageUrl;
                localStorage.setItem(
                  "instakart-user-details",
                  JSON.stringify(userDetails)
                );
              }
            } catch (err) {
              console.error("Failed to update profile image in backend", err);
              toast.error("Failed to update profile image.", {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
              const defaultImage = "https://via.placeholder.com/100";
              setValues((prev) => ({ ...prev, profileImage: defaultImage }));
            }
          } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            toast.error("Error uploading image.", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            const defaultImage = "https://via.placeholder.com/100";
            setValues((prev) => ({ ...prev, profileImage: defaultImage }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (formValues) => {
    setIsEditing(false);
    toast.success("Profile Information Updated!");

    try {
      const apiOptions = {
        url: `${apiConfig.profile}`,
        method: "PUT",
        data: formValues,
      };

      await ApiWithToken(apiOptions);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile information.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  // Define the fields for the Personal Information tab
  const personalInfoFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Email Address", name: "email", type: "email" },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Business Name", name: "businessName", type: "text" },
    { label: "Country", name: "country", type: "text" },
    { label: "City / State", name: "city", type: "text" },
    { label: "Postal Code", name: "postalCode", type: "text" },
    { label: "TAX ID", name: "taxId", type: "text" },
  ];

  // Define tabs for sidebar
  const tabs = [
    { name: "personalInfo", label: "Personal Information" },
    { name: "bankingInfo", label: "Banking information" },
    { name: "myProducts", label: "My Products" },
    { name: "myDocuments", label: "My documents" },
  ];

  return (
    <div className="profile-wrapper">
      <div className="profile-sidebar">
        <div className="profile-sidebar-inner">
          <ul className="sidebar-list">
            {tabs.map((tabItem) => (
              <li
                key={tabItem?.name}
                onClick={() => {
                  setTabState(tabItem?.name);
                  setIsEditing(false);
                }}
                name={tabItem?.name}
                className="sidebar-item"
              >
                {tabItem.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="profile-container">
        {tabState === "personalInfo" && (
          <div>
            <div className="header-section">
              <div
                className="profile-image-container"
                onClick={() => {
                  if (isEditing && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                style={{ cursor: isEditing ? "pointer" : "default" }}
              >
                {values.profileImage !== "" ? (
                  <img
                    src={values.profileImage}
                    alt="Profile"
                    className="profile-image"
                  />
                ) : (
                  <div className="profile-image-placeholder">
                    <span className="profile-image-text">
                      {values?.name[0]}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="profile-image-input"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />
                )}
              </div>
              <div className="header-info">
                <h1 className="profile-name">{values.username}</h1>
                <p className="profile-location">{values.phone}</p>
                <p className="profile-title">{values.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="section-container">
              <div className="section-header">
                <h2 className="section-title">Personal Information</h2>
                <div
                  className="edit-button"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </div>
              </div>
              <div className="info-grid">
                {personalInfoFields.map((field) => (
                  <ProfileInput
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    value={values[field.name] || ""}
                    readOnly={!isEditing}
                    onChange={handleChange}
                    error={errors[field.name]}
                    touched={touched[field.name]}
                  />
                ))}
              </div>
              {isEditing && (
                <div className="button-container">
                  <button className="save-button" type="submit">
                    Save
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
        {tabState === "bankingInfo" && <div>BankingInfo</div>}
        {tabState === "myProducts" && <div>My Products</div>}
        {tabState === "myDocuments" && (
          <div>
            <Documents />
          </div>
        )}

        <ToastContainer limit={1} position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default Profile;
