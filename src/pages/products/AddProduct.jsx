import React, { useState, useRef } from "react";
import "./AddProduct.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft",
    collection: "",
    weight: "",
    price: "",
    compareAtPrice: "",
    media: [],
  });

  const fileInputRef = useRef(null); // Create a ref

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        media: [...files],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const removeMedia = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      media: prevData.media.filter((_, i) => i !== index),
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear the input
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price) {
      toast.error("Title and Price are required.", {
        position: "bottom-right",
      });
      return;
    }

    if (!formData.price) {
      toast.error("Price is required.", {
        position: "bottom-right",
      });
      return;
    }

    if (
      formData.compareAtPrice &&
      parseFloat(formData.price) >= parseFloat(formData.compareAtPrice)
    ) {
      toast.error("Price must be less than Compare-at price.", {
        position: "bottom-right",
      });
      return;
    }

    console.log("Form Data:", formData);
  };

  return (
    <div className="add-product-container">
      <ToastContainer />
      <div className="header-container">
        <Link to="/products">
          <ArrowBackIcon />
        </Link>
        <h2 className="header">Add Product</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Short sleeve t-shirt"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Media</label>
          <div className="media-upload">
            <input
              ref={fileInputRef} // Add the ref
              type="file"
              name="media"
              accept="png,jpg,jpeg"
              multiple
              onChange={handleChange}
            />
          </div>
          <div className="media-preview">
            {formData.media.map((file, index) => (
              <div key={index} className="media-preview-item">
                <img
                  src={URL.createObjectURL(file)}
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
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>
        <div className="form-group">
          <label>Collection</label>
          <input
            type="text"
            name="collection"
            value={formData.collection}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Weight</label>
          <input
            type="number"
            name="weight"
            placeholder="gms"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>
        <div className="form-group ">
          <label>Pricing</label>
          <div className="pricing">
            <input
              type="text"
              name="price"
              value={formData.price}
              placeholder="price"
              onChange={handleChange}
            />
            <input
              name="compareAtPrice"
              placeholder="compare-at price"
              value={formData.compareAtPrice}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <button type="submit" className="submit-button">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;