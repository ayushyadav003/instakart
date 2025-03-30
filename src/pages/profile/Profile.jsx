import React, { useState, useEffect, useRef, useContext } from "react";
import "../../components/styles/Profile.scss";
import { apiConfig } from "../../services/ApiConfig";
import { ApiWithToken } from "../../services/ApiWithToken";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProfileContext } from "../../context/ProfileContext";

// Reusable Input Component
const ProfileInput = ({ label, name, value, readOnly, onChange, ...props }) => {
  return (
    <div className="info-item">
      <span className="info-label">{label}</span>
      <input
        name={name}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        className={
          readOnly ? "info-value info-readonly" : "info-value info-input"
        }
        {...props}
      />
    </div>
  );
};

const Profile = () => {
  const { profilePicture, setProfilePicture } = useContext(ProfileContext);

  const [user, setUser] = useState({
    username: "",
    email: "",
    profileImage: "https://via.placeholder.com/100",
    name: "",
    phone: "",
    businessName: "",
    country: "",
    city: "",
    postalCode: "",
    taxId: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Single editing state
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiOptions = {
          url: `${apiConfig.profile}`,
          method: "GET",
        };
        const response = await ApiWithToken(apiOptions);
        console.log(response.data.profilePicture, "rajatrajat");
        setUser({
          username: response.data.fullName || "",
          email: response.data.email || "",
          name: response.data.fullName || "",
          phone: response.data.mobile || "",
          businessName: response.data.businessName || "",
          country: response.data.country || "",
          city: response.data.city || "",
          postalCode: response.data.postalCode || "",
          taxId: response.data.taxId || "",
          profileImage: response.data.profilePicture || "",
        });

        console.log(response.data, "data");
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUser({
          username: "Error",
          email: "",
          name: "",
          phone: "",
          businessName: "",
          country: "",
          city: "",
          postalCode: "",
          taxId: "",
          profileImage: "https://via.placeholder.com/100",
        });
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
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          setUser((prev) => ({ ...prev, profileImage: e.target.result }));

          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "instakart");
          try {
            const cloudinaryResponse = await axios.post(
              "https://api.cloudinary.com/v1_1/dobzi0uvb/image/upload",
              formData
            );
            const imageUrl = cloudinaryResponse.data.secure_url;
            console.log("Hrllo")
            setProfilePicture(imageUrl);
            setUser((prev) => ({ ...prev, profileImage: imageUrl }));

            try {
              const apiOptions = {
                url: `${apiConfig.profile}`,
                method: "PUT",
                data: { profileImage: imageUrl },
              };
              await ApiWithToken(apiOptions);
              console.log("Profile image updated on backend");

              const storedUserDetails = localStorage.getItem(
                "instakart-user-details"
              );
              if (storedUserDetails) {
                const userDetails = JSON.parse(storedUserDetails);
                userDetails.profilePicture = imageUrl;
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
              setUser((prev) => ({
                ...prev,
                profileImage: "https://via.placeholder.com/100",
              }));
            }
          } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            toast.error("Error uploading image.", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            setUser((prev) => ({
              ...prev,
              profileImage: "https://via.placeholder.com/100",
            }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    //alert("Profile Information Updated!"); // Remove alert
    toast.success("Profile Information Updated!");

    try {
      const updatedData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
        country: user.country,
        city: user.city,
        postalCode: user.postalCode,
        taxId: user.taxId,
      };
      const apiOptions = {
        url: `${apiConfig.profile}`,
        method: "PUT",
        data: updatedData,
      };

      await ApiWithToken(apiOptions);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile information.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="profile-container">
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
          {user.profileImage !== "" ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="profile-image"
            />
          ) : (
            <div className="profile-image-placeholder">
              <span className="profile-image-text">{user?.name[0]}</span>
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
          <h1 className="profile-name">{user.username}</h1>
          <p className="profile-location">{user.phone}</p>
          <p className="profile-title">{user.email}</p>
        </div>
      </div>

      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Personal Information</h2>
          <button className="edit-button" onClick={handleEdit}>
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="info-grid">
          <ProfileInput
            label="Name"
            name="name"
            value={user.name}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
          <ProfileInput
            label="Email Address"
            type="email"
            name="email"
            value={user.email}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
          <ProfileInput
            label="Phone"
            name="phone"
            value={user.phone}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
          <ProfileInput
            label="Business Name"
            name="businessName"
            value={user.businessName}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
          <ProfileInput
            label="Country"
            name="country"
            value={user.country}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
          <ProfileInput
            label="City / State"
            name="city"
            value={user.city}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
          <ProfileInput
            label="Postal Code"
            name="postalCode"
            value={user.postalCode}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
          <ProfileInput
            label="TAX ID"
            name="taxId"
            value={user.taxId}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </div>
        {isEditing && (
          <div className="button-container">
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </div>
      <ToastContainer limit={1} position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Profile;
