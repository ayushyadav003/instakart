import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddVariant = ({ onVariantAdded }) => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    media: [],
    quantity: 0,
    price: 0,
    comparePrice: 0,
  });

  const handleChange = (e) => {
    if (e.target.name === "media") {
      const files = Array.from(e.target.files);
      setFormData({
        ...formData,
        media: [...formData.media, ...files],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const removeMedia = (index) => {
    setFormData({
      ...formData,
      media: formData.media.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error("Variant Title is required.", { position: "bottom-right" });
      return;
    }

    if (formData.comparePrice && formData.price >= formData.comparePrice) {
      toast.error("Price must be less than Compare-at Price.", {
        position: "bottom-right",
      });
      return;
    }

    try {
      // Upload media to Cloudinary
      const uploadedMediaUrls = await Promise.all(
        formData.media.map(async (file) => {
          if (typeof file === "string") {
            return file; // Keep existing URLs
          }
          const uploadData = new FormData();
          uploadData.append("file", file);
          uploadData.append("upload_preset", "instakart");

          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dobzi0uvb/image/upload",
            uploadData
          );
          return response.data.secure_url;
        })
      );

      const variantData = {
        title: formData.title,
        quantity: formData.quantity,
        price: formData.price,
        comparePrice: formData.comparePrice,
        media: uploadedMediaUrls,
      };

      // Create variant
      const variantResponse = await axios.post(
        `/api/v1/variants/${productId}`,
        variantData
      );

      const variantId = variantResponse.data._id;

      // Update product to add variant ID
      await axios.put(`/api/v1/products/${productId}`, {
        $push: { variants: variantId },
      });

      toast.success("Variant added successfully!");
      setFormData({
        title: "",
        media: [],
        quantity: 0,
        price: 0,
        comparePrice: 0,
      });
      if (onVariantAdded) {
        onVariantAdded(variantResponse.data);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.error("Error adding variant:", error);
      toast.error("Failed to add variant.");
    }
  };

  return (
    <div className="add-product-container">
      <ToastContainer limit={1} position="bottom-right" autoClose={3000} />
      <div className="header-container">
        <h2 className="header">Add Variant</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Variant Title</label>
          <input
            type="text"
            name="title"
            placeholder="Short sleeve t-shirt variant"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Variant Media</label>
          <input
            ref={fileInputRef}
            type="file"
            name="media"
            accept="png,jpg,jpeg"
            multiple
            onChange={handleChange}
          />
          <div className="media-preview">
            {formData.media.map((file, index) => (
              <div key={index} className="media-preview-item">
                <img
                  src={
                    typeof file === "string" ? file : URL.createObjectURL(file)
                  }
                  alt={`preview-${index}`}
                  className="preview-image"
                />
                <button
                  type="button"
                  className="remove-media"
                  onClick={() => removeMedia(index)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Pricing</label>
          <div className="pricing-contianer">
            <input
              type="number"
              name="price"
              value={formData.price}
              placeholder="Price"
              onChange={handleChange}
            />
            <input
              type="number"
              name="comparePrice"
              value={formData.comparePrice}
              placeholder="Compare-at price"
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          Save Variant
        </button>
      </form>
    </div>
  );
};

export default AddVariant;

