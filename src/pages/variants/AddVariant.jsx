import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "react-toastify/dist/ReactToastify.css";

const AddVariant = () => {
  const navigate = useNavigate();
  const { productId, variantId } = useParams();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    media: [],
    quantity: 0,
    price: 0,
    comparePrice: 0,
  });
const [productPrice, setProductPrice] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchVariantData = async () => {
      try {
        // Fetch product data to get the default price
        const productResponse = await axios.get(
          `http://localhost:5000/api/v1/products/${productId}`
        );
        setProductPrice(productResponse.data.price);

        // Fetch variant data
        const variantResponse = await axios.get(
          `http://localhost:5000/api/v1/variants/${variantId}`
        );

        // Ensure media is an array of URLs
        const variantData = variantResponse.data;
        const mediaUrls = variantData.media || [];

        setFormData({
          title: variantData.title,
          media: mediaUrls,
          quantity: variantData.quantity,
          price: variantData.price,
          comparePrice: variantData.comparePrice,
        });
      } catch (error) {
        console.error("Error fetching variant data:", error);
        toast.error("Failed to fetch variant data.");
        navigate(`/product/${productId}`); // Redirect to product page on error
      } finally {
        setLoading(false);
      }
    };

    if (productId && variantId) {
      fetchVariantData();
    } else {
      setLoading(false); // Ensure loading is set to false if IDs are missing
    }
  }, [productId, variantId, navigate]);

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

    if (formData.quantity <= 0 || !formData.quantity) {
      toast.error("Quantity must be greater than zero.", {
        position: "bottom-right",
      });
      return;
    }

    if (formData.comparePrice && formData.price >= formData.comparePrice) {
      toast.error("Price must be less than Compare-at Price.", {
        position: "bottom-right",
      });
      return;
    }

    try {
      const uploadedMediaUrls = await Promise.all(
        formData.media.map(async (file) => {
          if (typeof file === "string") {
            return file; // Keep existing Cloudinary URLs
          }
          const uploadData = new FormData();
          uploadData.append("file", file, file.name); // use file.name
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
        price: formData.price !== 0 ? formData.price : productPrice,
        comparePrice:
          formData.comparePrice !== 0 ? formData.comparePrice : productPrice,
        media: uploadedMediaUrls,
      };

      await axios.put(`/api/v1/variants/${variantId}`, variantData);

      toast.success("Variant updated successfully!");
      navigate(`/product/${productId}`); // Redirect to product details page
    } catch (error) {
      console.error("Error updating variant:", error);
      toast.error("Failed to update variant.");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Simple loading indicator
  }

  return (
    <div className="add-product-container">
      <ToastContainer limit={1} position="bottom-right" autoClose={3000} />
      <div className="header-container">
        <Link to={`/product/${productId}`}>
          <ArrowBackIcon />
        </Link>
        <h2 className="header">Update Variant</h2>
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
