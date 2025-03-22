import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./AddProduct.scss";

const AddProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const fileInputRef = useRef(null);

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
  });

  const [originalData, setOriginalData] = useState(null);

  // Fetch product data if updating
  useEffect(() => {
    if (productId) {
      axios
        .get(`http://localhost:5000/api/v1/products/${productId}`)
        .then((response) => {
          const product = response.data;

          // Ensure media URLs are handled separately
          setFormData({
            title: product.title || "",
            description: product.description || "",
            status: product.status || "draft",
            price: product.price || "",
            comparePrice: product.comparePrice || "",
            media: product.mediaUrls || [], // Use mediaUrls from API
            weight: product.weight || "",
            length: product.length || "",
            breadth: product.breadth || "",
            height: product.height || "",
            quantity: product.quantity || 0,
          });

          setOriginalData(product);
        })
        .catch((error) => console.error("Error fetching product:", error));
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? [...files] : value,
    }));
  };

  const removeMedia = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      media: prevData.media.filter((_, i) => i !== index),
    }));
    if (fileInputRef.current) fileInputRef.current.value = null;
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

    try {
      // Separate existing images from new files
      const existingMediaUrls = formData.media.filter(
        (item) => typeof item === "string"
      );
      const newFiles = formData.media.filter(
        (item) => typeof item !== "string"
      );

      // Upload only new images
      const uploadedMediaUrls = await Promise.all(
        newFiles.map(async (file) => {
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

      console.log("mediurls",uploadedMediaUrls);

      // Combine old and new media URLs
      const mediaUrls = [...existingMediaUrls, ...uploadedMediaUrls];

      const productData = { ...formData,mediaUrls };

      if (productId) {
        await axios.put(
          `http://localhost:5000/api/v1/products/${productId}`,
          productData
        );
        toast.success("Product updated successfully!", {
          position: "bottom-right",
        });
      } else {
        console.log('IN added')
        await axios.post("http://localhost:5000/api/v1/products", productData);
        toast.success("Product added successfully!", {
          position: "bottom-right",
        });
      }

      navigate("/products");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Operation failed.", { position: "bottom-right" });
    }
  };

  return (
    <div className="add-product-container">
      <ToastContainer />
      <div className="header-container">
        <Link to="/products">
          <ArrowBackIcon />
        </Link>
        <h2 className="header">
          {productId ? "Update Product" : "Add Product"}
        </h2>
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
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>
        <div className="form-group">
          <label>Weight (gms)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Dimensions (cm)</label>
          <input
            type="number"
            name="length"
            placeholder="Length"
            value={formData.length}
            onChange={handleChange}
          />
          <input
            type="number"
            name="breadth"
            placeholder="Breadth"
            value={formData.breadth}
            onChange={handleChange}
          />
          <input
            type="number"
            name="height"
            placeholder="Height"
            value={formData.height}
            onChange={handleChange}
          />
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
              placeholder="Compare-at price"
              value={formData.comparePrice}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" className="submit-button">
          {productId ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
