import React, { useState, useRef } from "react";
import "./AddProduct.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft",
    price: "",
    comparePrice: "",
    media: [],
    weight: "",
    length: "",
    breadth: "",
    height: "",
    quantity: 0,
    // Add other fields from your schema if needed
  });

  const fileInputRef = useRef(null);

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
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price) {
      toast.error("Title and Price are required.", {
        position: "bottom-right",
      });
      return;
    }

    if (
      formData.comparePrice &&
      parseFloat(formData.price) >= parseFloat(formData.comparePrice)
    ) {
      toast.error("Price must be less than Compare-at price.", {
        position: "bottom-right",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("comparePrice", formData.comparePrice);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("weight", formData.weight);
    formDataToSend.append("length", formData.length);
    formDataToSend.append("breadth", formData.breadth);
    formDataToSend.append("height", formData.height);
    formDataToSend.append("quantity", formData.quantity);

    formData.media.forEach((file) => {
      formDataToSend.append("media", file);
    });

    try {
      const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
      const response = await axios.post("/api/products", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product added successfully!", {
        position: "bottom-right",
      });
      navigate("/products");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.message || "Failed to add product.", {
        position: "bottom-right",
      });
    }
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
              ref={fileInputRef}
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
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
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

        <div className="form-group">
          <label>Length</label>
          <input
            type="number"
            name="length"
            placeholder="cm"
            value={formData.length}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Breadth</label>
          <input
            type="number"
            name="breadth"
            placeholder="cm"
            value={formData.breadth}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Height</label>
          <input
            type="number"
            name="height"
            placeholder="cm"
            value={formData.height}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            placeholder="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>
        <div className="form-group ">
          <label>Pricing</label>
          <div className="pricing">
            <input
              type="number"
              name="price"
              value={formData.price}
              placeholder="price"
              onChange={handleChange}
            />
            <input
              type="number"
              name="comparePrice"
              placeholder="compare-at price"
              value={formData.comparePrice}
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