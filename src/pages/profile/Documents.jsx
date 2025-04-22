import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../components/styles/Profile.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiConfig } from "../../services/ApiConfig";
import { ApiWithToken } from "../../services/ApiWithToken";
import { FaTimesCircle } from "react-icons/fa";
import axios from "axios"; // Import axios for Cloudinary upload

const Documents = ({ initialDocuments }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (accordionName) => {
    setActiveAccordion((prev) => (prev === accordionName ? null : accordionName));
  };

  const initialValues = {
    gstNumber: "",
    gstImage: "", // Store URL instead of File object
    panNumber: "",
    panImage: "", // Store URL instead of File object
  };

  if (initialDocuments) {
    initialValues.gstNumber = initialDocuments.gstNumber || "";
    initialValues.panNumber = initialDocuments.panNumber || "";
    initialValues.gstImage = initialDocuments.gstImage || "";
    initialValues.panImage = initialDocuments.panImage || "";
  }

  const validationSchema = Yup.object().shape({
    gstNumber: Yup.string().max(20, "GST number must be at most 20 characters"),
    gstImage: Yup.string(), // Expecting a URL string
    panNumber: Yup.string().max(20, "PAN number must be at most 20 characters"),
    panImage: Yup.string(), // Expecting a URL string
  });

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    touched,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (formValues) => {
      console.log("Form Values:", formValues);
      handleSave(formValues);
      setIsEditing(false);
    },
    enableReinitialize: true,
  });

  // useEffect(() => {
  //   if (initialDocuments) {
  //     resetForm({ values: initialValues });
  //   }
  // }, [initialDocuments, resetForm, initialValues]);

  const handleRemoveImage = (fieldName) => {
    setFieldValue(fieldName, ""); // Clear the URL
  };

  const uploadImageToCloudinary = async (file) => {
    if (!file) return "";
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("upload_preset", "instakart"); // Use your upload preset
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dobzi0uvb/image/upload", // Use your Cloudinary cloud name
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      toast.error("Failed to upload image.");
      return "";
    }
  };

  const handleImageChange = async (event, fieldName) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const imageUrl = await uploadImageToCloudinary(file);
      if (imageUrl) {
        setFieldValue(fieldName, imageUrl);
      }
    }
  };

  const handleSave = async (formValues) => {
    try {
      const profileData = {
        gstNumber: formValues.gstNumber,
        panNumber: formValues.panNumber,
        gstImage: formValues.gstImage,
        panImage: formValues.panImage,
      };

      const apiOptions = {
        url: `${apiConfig.profile}`,
        method: "PUT",
        data: {documents:profileData},
        headers: {
          "Content-Type": "application/json", // Or the appropriate content type for your API
        },
      };

      await ApiWithToken(apiOptions);
      toast.success("Documents Updated Successfully!");
    } catch (error) {
      console.error("Failed to update documents:", error);
      toast.error("Failed to update documents.");
    }
  };

  return (
    <div>
      <div
        className="info-headers"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 className="banking-info-title">Documents</h2>
        <div className="edit-button" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="documents-container">
        {/* GST Accordion */}
        <div className="document-accordion">
          <div
            className="accordion-header"
            onClick={() => toggleAccordion("gst")}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              background: "#f1f1f1",
              border: "1px solid #ccc",
            }}
          >
            <span>GST Details</span>
            <span>{activeAccordion === "gst" ? "-" : "+"}</span>
          </div>
          {activeAccordion === "gst" && (
            <div className="accordion-content" style={{ padding: "10px" }}>
              <div className="document-item-container">
                <div class="document-item">
                  <label>GST Number</label>
                  <input
                    maxLength={15}
                    type="text"
                    name="gstNumber"
                    placeholder="Enter GST Number"
                    onChange={handleChange}
                    value={values.gstNumber}
                    disabled={!isEditing}
                    className={errors.gstNumber && touched.gstNumber ? "error" : ""}
                  />
                </div>
                {errors.gstNumber && touched.gstNumber && (
                  <div className="error-message">{errors.gstNumber}</div>
                )}
              </div>
              <div className="document-item">
                <label>GST Image</label>
                <input
                  type="file"
                  name="gstImage"
                  onChange={(event) => handleImageChange(event, "gstImage")}
                  disabled={!isEditing}
                />
                {values.gstImage && (
                  <div className="image-preview">
                    <img
                      src={values.gstImage}
                      alt="GST Preview"
                      className="preview-image"
                    />
                    {isEditing && (
                      <div
                        type="button"
                        className="remove-image-button"
                        onClick={() => handleRemoveImage("gstImage")}
                      >
                         ❌
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* PAN Accordion */}
        <div className="document-accordion">
          <div
            className="accordion-header"
            onClick={() => toggleAccordion("pan")}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              background: "#f1f1f1",
              border: "1px solid #ccc",
              marginTop: "10px",
            }}
          >
            <span>PAN Details</span>
            <span>{activeAccordion === "pan" ? "-" : "+"}</span>
          </div>
          {activeAccordion === "pan" && (
            <div className="accordion-content" style={{ padding: "10px" }}>
              <div className="document-item-container">
                <div class="document-item">
                  <label>PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    maxLength={10}
                    placeholder="Enter PAN Number"
                    onChange={handleChange}
                    value={values.panNumber}
                    disabled={!isEditing}
                    className={errors.panNumber && touched.panNumber ? "error" : ""}
                  />
                  {errors.panNumber && touched.panNumber && (
                    <div className="error-message">{errors.panNumber}</div>
                  )}
                </div>
              </div>
              <div className="document-item">
                <label>PAN Image</label>
                <input
                  type="file"
                  name="panImage"
                  onChange={(event) => handleImageChange(event, "panImage")}
                  disabled={!isEditing}
                />
                {values.panImage && (
                  <div className="image-preview">
                    <img
                      src={values.panImage}
                      alt="PAN Preview"
                      className="preview-image"
                    />
                    {isEditing && (
                      <div
                        type="button"
                        className="remove-image-button"
                        onClick={() => handleRemoveImage("panImage")}
                      >
                         ❌
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="button-container" style={{ marginTop: "20px" }}>
            <button className="save-button" type="submit">
              Save Details
            </button>
          </div>
        )}
      </form>
      <ToastContainer limit={1} position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Documents;