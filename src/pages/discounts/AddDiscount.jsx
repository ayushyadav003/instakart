import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiWithToken } from "../../services/ApiWithToken";
import { apiConfig } from "../../services/ApiConfig";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useFormik } from "formik";
import { format, parseISO } from "date-fns";
import * as Yup from "yup";

import "./Discount.scss";

const AddDiscount = () => {
  const { discountId } = useParams(); // Get discountId from URL params
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const validationSchema = Yup.object({
    couponName: Yup.string().required("Coupon name is required"),

    couponType: Yup.string()
      .oneOf(
        ["percentage", "value", "cart price", "bundle product"],
        "Invalid coupon type"
      )
      .required("Coupon type is required"),

    discountValue: Yup.number().when("couponType", {
      is: "value",
      then: (schema) =>
        schema
          .required("Discount value is required")
          .min(0, "Discount value cannot be negative"),
      otherwise: (schema) => schema.notRequired(),
    }),

    discountPercentage: Yup.number().when("couponType", {
      is: "percentage",
      then: (schema) =>
        schema
          .required("Discount percentage is required")
          .min(0, "Discount percentage cannot be negative") 
          .max(100, "Discount percentage cannot exceed 100"),
      otherwise: (schema) => schema.notRequired(),
    }),

    noOfProductsToBuy: Yup.number().when("couponType", {
      is: "bundle product",
      then: (schema) =>
        schema
          .required("This field is required for bundle product type")
          .min(0, "Number of products to buy cannot be negative"),
      otherwise: (schema) => schema.notRequired(),
    }),

    noOfProductsFree: Yup.number().when("couponType", {
      is: "bundle product",
      then: (schema) =>
        schema
          .required("This field is required for bundle product type")
          .min(0, "Number of free products cannot be negative"),
      otherwise: (schema) => schema.notRequired(),
    }),

    minCartValue: Yup.number()
      .min(0, "Minimum cart value cannot be negative")
      .required("Minimum cart value is required"),

    expiresAt: Yup.date()
      .required("Expiry date is required")
  });

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      couponName: "",
      couponType: "percentage",
      discountValue: 0,
      discountPercentage: 0,
      noOfProductsToBuy: 0,
      noOfProductsFree: 0,
      minCartValue: 0,
      expiresAt: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Form values:", values);
        const apiOptions = {
          url: discountId
            ? `${apiConfig.updateDiscount}/${discountId}`
            : apiConfig.createDiscount,
          method: discountId ? "PUT" : "POST",
          data: values,
        };
        const response = await ApiWithToken(apiOptions);
        if (response?.status >= 200 && response?.status < 300) {
          toast.success(
            discountId
              ? "Discount updated successfully!"
              : "Discount created successfully!"
          );
          setTimeout(() => {
            navigate("/discounts");
          }, 1000);
        }
        else{
          toast.error(
            response?.response?.data?.message ||
              "An error occurred. Please try again."
          );
        }
      
    },
  });

  // Fetch discount details if updating
  useEffect(() => {
    const fetchDiscount = async () => {
      if (discountId) {
        try {
          const response = await ApiWithToken({
            url: `${apiConfig.getDiscountById}/${discountId}`,
            method: "GET",
          });
          if (response.status === 200) {
            // response.data.expiresAt = format(parseISO(expiresAt), 'yyyy-MM-dd');
            console.log(
              "Fetched discount details:",
              format(parseISO(response.data.expiresAt), "yyyy-MM-dd")
            );
            formik.setValues({
              ...response.data,
              expiresAt: format(
                parseISO(response.data.expiresAt),
                "yyyy-MM-dd"
              ),
            });
            console.log(response.data, "response data");
            console.log("Fetched discount details:", formik.values);
          } else {
            toast.error("Failed to fetch discount details.");
          }
        } catch (error) {
          console.error("Error fetching discount:", error);
          toast.error("Failed to fetch discount details.");
        }
      }
    };
    fetchDiscount();
  }, [discountId]);

  return (
    <div className="add-discount-container">
      <ToastContainer limit={1} position="bottom-right" autoClose={3000} />
      <div className="header-container">
        <Link to="/discounts">
          <ArrowBackIcon />
        </Link>
        <h2>{discountId ? "Update Discount" : "Add Discount"}</h2>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label>Coupon Name</label>
          <input
            type="text"
            name="couponName"
            value={formik.values.couponName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.couponName && formik.errors.couponName && (
            <div className="error">{formik.errors.couponName}</div>
          )}
        </div>
        <div className="form-group">
          <label>Coupon Type</label>
          <select
            name="couponType"
            value={formik.values.couponType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="percentage">Percentage</option>
            <option value="value">Value</option>
            <option value="cart price">Cart Price</option>
            <option value="bundle product">Bundle Product</option>
          </select>
          {formik.touched.couponType && formik.errors.couponType && (
            <div className="error">{formik.errors.couponType}</div>
          )}
        </div>
        <div className="form-group">
          <label>Discount Value</label>
          <input
            type="number"
            name="discountValue"
            value={formik.values.discountValue}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.values.couponType !== "value"}
          />
          {formik.touched.discountValue && formik.errors.discountValue && (
            <div className="error">{formik.errors.discountValue}</div>
          )}
        </div>
        <div className="form-group">
          <label>Discount Percentage</label>
          <input
            type="number"
            name="discountPercentage"
            value={formik.values.discountPercentage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.values.couponType !== "percentage"}
          />
          {formik.touched.discountPercentage &&
            formik.errors.discountPercentage && (
              <div className="error">{formik.errors.discountPercentage}</div>
            )}
        </div>
        <div className="form-group">
          <label>Minimum Cart Value</label>
          <input
            type="number"
            name="minCartValue"
            value={formik.values.minCartValue}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.minCartValue && formik.errors.minCartValue && (
            <div className="error">{formik.errors.minCartValue}</div>
          )}
        </div>
        <div className="form-group">
          <label>No. of Products to Buy</label>
          <input
            type="number"
            name="noOfProductsToBuy"
            value={formik.values.noOfProductsToBuy}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.values.couponType !== "bundle product"}
          />
          {formik.touched.noOfProductsToBuy &&
            formik.errors.noOfProductsToBuy && (
              <div className="error">{formik.errors.noOfProductsToBuy}</div>
            )}
        </div>
        <div className="form-group">
          <label>No. of Products Free</label>
          <input
            type="number"
            name="noOfProductsFree"
            value={formik.values.noOfProductsFree}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.values.couponType !== "bundle product"}
          />
          {formik.touched.noOfProductsFree &&
            formik.errors.noOfProductsFree && (
              <div className="error">{formik.errors.noOfProductsFree}</div>
            )}
        </div>
        <div className="form-group">
          <label>Expires At</label>
          <input
            type="date"
            min={today}
            name="expiresAt"
            value={formik.values.expiresAt}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.expiresAt && formik.errors.expiresAt && (
            <div className="error">{formik.errors.expiresAt}</div>
          )}
        </div>
        <button type="submit" className="add-discount-button">
          {discountId ? "Update Discount" : "Add Discount"}
        </button>
      </form>
    </div>
  );
};

export default AddDiscount;
