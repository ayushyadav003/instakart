import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./AddProduct.scss";
import CommonTable from "../../components/common/CommonTable";
import { variantTableHead } from "../../utils/tableHead";
import { ApiWithToken } from "../../services/ApiWithToken";
import { apiConfig } from "../../services/ApiConfig";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../../redux/features/userSlice";
import axios from "axios";

const AddProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

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
    categories: [],
  });

  const [categoryInput, setCategoryInput] = useState("");
  const [productData, setProductData] = useState(null);
  const [refreshVariants, setRefreshVariants] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          dispatch(startLoading());
          const apiOptions = {
            url: `${apiConfig.getProductById}/${productId}`,
            method: "GET",
          };
          const response = await ApiWithToken(apiOptions);
          console.log(response.data, "apidetails");
          if (response?.status === 200) {
            const product = response.data;
            setProductData(product);
            setFormData({
              title: product.title || "",
              description: product.description || "",
              status: product.status || "draft",
              price: product.price || "",
              comparePrice: product.comparePrice || "",
              media: product.mediaUrls || [],
              weight: product.weight || "",
              length: product.length || "",
              breadth: product.breadth || "",
              height: product.height || "",
              quantity: product.quantity || 0,
              categories: product.categories || [],
            });
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          toast.error("Failed to fetch product data.", {
            position: "bottom-right",
          });
        } finally {
          dispatch(stopLoading());
        }
      }
    };
    fetchProduct();
  }, [productId, refreshVariants, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? [...files] : value,
    }));
  };

  const handleCategoryChange = (e) => {
    setCategoryInput(e.target.value);
  };

  const handleCategoryAdd = () => {
    if (
      categoryInput.trim() &&
      !formData.categories.includes(categoryInput.trim())
    ) {
      setFormData((prevData) => ({
        ...prevData,
        categories: [...prevData.categories, categoryInput.trim()],
      }));
      setCategoryInput("");
    }
  };

  const handleCategoryRemove = (category) => {
    setFormData((prevData) => ({
      ...prevData,
      categories: prevData.categories.filter((c) => c !== category),
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
      dispatch(startLoading());
      const existingMediaUrls = formData.media.filter(
        (item) => typeof item === "string"
      );
      const newFiles = formData.media.filter(
        (item) => typeof item !== "string"
      );

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

      const mediaUrls = [...existingMediaUrls, ...uploadedMediaUrls];
      const productDataToSend = { ...formData, mediaUrls };

      let apiOptions;
      if (productId) {
        apiOptions = {
          url: `${apiConfig.updateProduct}/${productId}`,
          method: "PUT",
          data: productDataToSend,
        };omm
      } else {
        apiOptions = {
          url: apiConfig.productUrl,
          method: "POST",
          data: productDataToSend,
        };
      }

      await ApiWithToken(apiOptions);

      toast.success(
        productId
          ? "Product updated successfully!"
          : "Product added successfully!",
        {
          position: "bottom-right",
        }
      );
      navigate("/products");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Operation failed.", { position: "bottom-right" });
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleDeleteVariant = async (variant) => {
    try {
      dispatch(startLoading());
      const apiOptions = {
        url: `${apiConfig.variantUrl}/${variant._id}`, // Corrected URL
        method: "DELETE",
      };
      await ApiWithToken(apiOptions);
      toast.success("Variant deleted successfully!", {
        position: "bottom-right",
      });
      setRefreshVariants((prev) => !prev); // Trigger refresh
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Failed to delete variant.", {
        position: "bottom-right",
      });
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <div className="add-product-container">
      <ToastContainer limit={1} position="bottom-right" autoClose={3000} />
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
          <label>Category</label>
          <div className="category-input-container">
            <input
              type="text"
              value={categoryInput}
              onChange={handleCategoryChange}
              placeholder="Enter category name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCategoryAdd();
                }
              }}
            />
          </div>
          <div className="category-tags-container">
            {formData.categories.map((category) => (
              <div key={category} className="category-tag">
                <span>{category}</span>
                <button
                  type="button"
                  onClick={() => handleCategoryRemove(category)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
        {productId ? (
          <div className="form-group">
            <label>Variants</label>

            {productData &&
            productData.variants &&
            productData.variants.length > 0 ? (
              <div className="variants-table-container">
                <CommonTable
                  head={variantTableHead}
                  rows={productData.variants}
                  type="variants"
                  onDelete={handleDeleteVariant} // Pass delete handler
                />
              </div>
            ) : null}
            <Link to={`/add-variant/${productId}`} className="variant-btn">
              Add variants
            </Link>
          </div>
        ) : (
          <></>
        )}

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
