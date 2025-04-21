import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../components/styles/Profile.scss"; // Assuming this is where your shared styles are
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiConfig } from "../../services/ApiConfig";
import { ApiWithToken } from "../../services/ApiWithToken";
const ProfileInput = ({
  label,
  name,
  value,
  readOnly,
  onChange,
  error,
  touched,
  isEditing,
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
      {isEditing && error && touched && (
        <div className="error-message">{error}</div>
      )}
    </div>
  );
};

const BankingInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const initialValues = {
    beneficiaryName: "",
    accountNumber: "",
    reEnterAccountNumber: "",
    accountType: "Savings",
    ifsc: "",
    bankName: "ICICI Bank",
  };

  const validationSchema = Yup.object({
    beneficiaryName: Yup.string().required("Beneficiary Name is required"),
    accountNumber: Yup.string()
      .matches(/^\d+$/, "Account number must contain only digits")
      .max(16, "Account number must be at most 16 digits")
      .required("Account Number is required"),
    reEnterAccountNumber: Yup.string()
      .oneOf([Yup.ref("accountNumber"), null], "Account numbers must match")
      .max(16, "Account number must be at most 16 digits")
      .required("Please re-enter account number"),
    accountType: Yup.string().required("Account Type is required"),
    ifsc: Yup.string()
      .max(11, "IFSC code must be at most 11 digits")
      .required("IFSC is required"),
    bankName: Yup.string().required("Bank Name is required"),
  });

  const { handleSubmit, handleChange, values, errors, touched, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: (formValues) => {
        console.log(formValues);
        handleSave(formValues);
        setIsEditing(false);
      },
    });

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
      toast.error("Failed to update profile information");
    }
  };

  return (
    <div className="banking-info-container">
      <div
        className="banking-info-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 className="banking-info-title">Banking Details</h2>
        <div className="edit-button" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="section-container">
        <div className="info-grid banking-details-grid">
          <ProfileInput
            label="Beneficiary Name"
            name="beneficiaryName"
            type="text"
            value={values.beneficiaryName}
            onChange={handleChange}
            readOnly={!isEditing}
            error={errors.beneficiaryName}
            touched={touched.beneficiaryName}
            isEditing={isEditing}
          />

          <div className="info-item">
            <span className="info-label">Account Type</span>
            <select
              name="accountType"
              value={values.accountType}
              onChange={handleChange}
              disabled={!isEditing}
              className={
                (isEditing
                  ? "info-value info-input"
                  : "info-value info-readonly") +
                (errors.accountType && touched.accountType ? " error" : "")
              }
            >
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
            </select>
            {errors.accountType && touched.accountType && (
              <div className="error-message">{errors.accountType}</div>
            )}
          </div>

          <ProfileInput
            label="Account Number"
            name="accountNumber"
            type="text"
            value={values.accountNumber}
            onChange={handleChange}
            readOnly={!isEditing}
            error={errors.accountNumber}
            touched={touched.accountNumber}
            isEditing={isEditing}
            maxLength={16}
          />

          <ProfileInput
            label="Re-enter Account Number"
            name="reEnterAccountNumber"
            type="text"
            value={values.reEnterAccountNumber}
            onChange={handleChange}
            readOnly={!isEditing}
            error={errors.reEnterAccountNumber}
            touched={touched.reEnterAccountNumber}
            isEditing={isEditing}
            maxLength={16}
          />

          <ProfileInput
            label="IFSC"
            name="ifsc"
            type="text"
            value={values.ifsc}
            onChange={handleChange}
            readOnly={!isEditing}
            error={errors.ifsc}
            touched={touched.ifsc}
            maxLength={11}
          />

          <div className="info-item">
            <span className="info-label">Bank Name</span>
            <select
              name="bankName"
              value={values.bankName}
              onChange={handleChange}
              disabled={!isEditing}
              className={
                (isEditing
                  ? "info-value info-input"
                  : "info-value info-readonly") +
                (errors.bankName && touched.bankName ? " error" : "")
              }
            >
              <option value="ICICI Bank">ICICI Bank</option>
              <option value="HDFC Bank">HDFC Bank</option>
              <option value="SBI">SBI</option>
              <option value="Axis Bank">Axis Bank</option>
              <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
            </select>
            {errors.bankName && touched.bankName && (
              <div className="error-message">{errors.bankName}</div>
            )}
          </div>
        </div>
        {isEditing && (
          <div className="button-container">
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

export default BankingInfo;
