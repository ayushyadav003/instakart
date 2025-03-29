import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "react-toastify/dist/ReactToastify.css";
import { apiConfig } from "../../services/ApiConfig";
import { ApiWithToken } from "../../services/ApiWithToken";
import axios from "axios";

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
  const [loading, setLoading] = useState(true);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [productData, setProductData] = useState({}); // To store product data

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data to get the default price
        const productResponse = await ApiWithToken({
          url: `${apiConfig.getProductById}/${productId}`, // Use the correct API endpoint
          method: "GET",
        });
        setProductData(productResponse.data);
        setProductPrice(productResponse.data.price);

        if (variantId) {
          setIsUpdateMode(true);
          // Fetch variant data
          const variantResponse = await ApiWithToken({
            url: `${apiConfig.variantUrl}/${variantId}`, // Use the correct API endpoint
            method: "GET",
          });

          const variantData = variantResponse.data;
          const mediaUrls = variantData.media || [];

          setFormData({
            title: variantData.title,
            media: mediaUrls,
            quantity: variantData.quantity,
            price: variantData.price,
            comparePrice: variantData.comparePrice,
          });
        }
      } catch (error) {
        console.error(
          `Error fetching ${variantId ? "variant" : "product"} data:`,
          error
        );
        toast.error(
          `Failed to fetch ${variantId ? "variant" : "product"} data.`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
            return file;
          }
          const uploadData = new FormData();
          uploadData.append("file", file, file.name);
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

      if (isUpdateMode) {
        // Update existing variant
        await ApiWithToken({
          url: `${apiConfig.variantUrl}/${variantId}`, // Correct URL
          method: "PUT",
          data: variantData,
        });
        toast.success("Variant updated successfully!");
      } else {
        // Add new variant and update product
        const createVariantResponse = await ApiWithToken({
          url: `${apiConfig.variantUrl}/${productId}`, // Correct URL for creating variant
          method: "POST",
          data: variantData,
        });

        const newVariantId = createVariantResponse.data._id; // Get the new variant ID

        // Update the product with the new variant ID
        await ApiWithToken({
          url: `${apiConfig.updateProduct}/${productId}`, // Correct URL to update product
          method: "PUT",
          data: {
            variants: [...(productData.variants || []), newVariantId], // Add the new ID to the existing array
          },
        });

        toast.success("Variant added successfully!");
      }

      navigate(`/product/${productId}`);
    } catch (error) {
      console.error(
        `Error ${isUpdateMode ? "updating" : "adding"} variant:`,
        error
      );
      toast.error(`Failed to ${isUpdateMode ? "update" : "add"} variant.`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-product-container">
      <ToastContainer limit={1} position="bottom-right" autoClose={3000} />
      <div className="header-container">
        <Link to={`/product/${productId}`}>
          <ArrowBackIcon />
        </Link>
        <h2 className="header">
          {isUpdateMode ? "Update Variant" : "Add Variant"}
        </h2>
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
          {isUpdateMode ? "Save Variant" : "Add Variant"}
        </button>
      </form>
    </div>
  );
};

export default AddVariant;
