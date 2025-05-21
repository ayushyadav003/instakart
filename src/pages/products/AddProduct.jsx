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
import Editor, {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnNumberedList,
  Toolbar,
} from "react-simple-wysiwyg";
import * as Yup from "yup";
import { useFormik } from "formik";

const defaultFormData = {
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
};

const AddProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const [categoryInput, setCategoryInput] = useState("");
  const [refreshVariants, setRefreshVariants] = useState(false);

  const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  comparePrice: Yup.number()
    .positive('Compare-at price must be positive')
    .when('price', (price, schema) =>
      price && schema.lessThan(price, 'Compare-at price must be less than Price')
    ),
  weight: Yup.number().min(0, 'Weight cannot be negative'),
  length: Yup.number().min(0, 'Length cannot be negative'),
  breadth: Yup.number().min(0, 'Breadth cannot be negative'),
  height: Yup.number().min(0, 'Height cannot be negative'),
  quantity: Yup.number().integer('Quantity must be an integer').min(0, 'Quantity cannot be negative'),
  categories: Yup.array().of(Yup.string()),
});

  const { handleChange, values, handleSubmit, setFieldValue, setValues } =
    useFormik({
      initialValues: defaultFormData,
      // validationSchema: validationSchema,
      onSubmit: (values) => {
        productSubmitHandle(values);
      },
    });

  useEffect(() => {
    const fetchProduct = async () => {
      dispatch(startLoading());
      try {
        const url = productId
          ? `${apiConfig.getProductById}/${productId}`
          : null;
        if (url) {
          const { status, data } = await ApiWithToken({ url, method: "GET" });
          if (status === 200) {
            const { mediaUrls = [], ...rest } = data.product;
            const fetchedFormData = {
              ...defaultFormData,
              ...rest,
              media: mediaUrls,
            };
            await setValues(fetchedFormData);
          } else {
            toast.error("Failed to fetch product data.", {
              position: "bottom-right",
            });
          }
        } else {
          setValues(defaultFormData);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product data.", {
          position: "bottom-right",
        });
      } finally {
        dispatch(stopLoading());
      }
    };
    fetchProduct();
  }, [productId, dispatch, setValues]);

  const handleMediaChange = ({ target: { files } }) => {
    setFieldValue("media", [...values.media, ...Array.from(files)]);
  };

  const handleCategoryChange = ({ target: { value } }) =>
    setCategoryInput(value);

  const handleCategoryAdd = () => {
    const newCategory = categoryInput.trim();
    if (newCategory && !values.categories.includes(newCategory)) {
      setFieldValue("categories", [...values.categories, newCategory]);
      setCategoryInput("");
    }
  };

  const handleCategoryRemove = (categoryToRemove) => {
    setFieldValue(
      "categories",
      values.categories.filter((c) => c !== categoryToRemove)
    );
  };

  const removeMedia = (itemToRemove) => {
    setFieldValue(
      "media",
      values.media.filter((mediaItem) => mediaItem !== itemToRemove)
    );
    if (itemToRemove instanceof File && fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const productSubmitHandle = async (values, e) => {
    console.log(values, "values from submit");
    dispatch(startLoading());
    try {
      const newFilesToUpload = values.media.filter(
        (item) => item instanceof File
      );
      const existingMediaUrls = values.media.filter(
        (item) => typeof item === "string"
      );
      const uploadedNewUrls = await Promise.all(
        newFilesToUpload.map(async (file) => {
          const uploadData = new FormData();
          uploadData.append("file", file, file.name);
          uploadData.append("upload_preset", "instakart");
          const { data: cloudinaryResponse } = await axios.post(
            "https://api.cloudinary.com/v1_1/dobzi0uvb/image/upload",
            uploadData
          );
          return cloudinaryResponse.secure_url;
        })
      );
      const finalMediaUrls = [...existingMediaUrls, ...uploadedNewUrls];
      const productDataToSend = {
        ...values,
        media: undefined,
        mediaUrls: finalMediaUrls,
      };
      delete productDataToSend.media;

      const apiOptions = {
        url: productId
          ? `${apiConfig.updateProduct}/${productId}`
          : apiConfig.createProduct,
        method: productId ? "PUT" : "POST",
        data: productDataToSend,
      };
      console.log(apiOptions, "apiOptions from submit");
      const successMessage = productId
        ? "Product updated successfully!"
        : "Product added successfully!";

      await ApiWithToken(apiOptions);
      toast.success(successMessage, { position: "bottom-right" });
      navigate("/products");
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMsg =
        error.response?.data?.message || "Operation failed. Please try again.";
      toast.error(errorMsg, { position: "bottom-right" });
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleDeleteVariant = async (variantToDelete) => {
    if (!values || !variantToDelete) return;
    dispatch(startLoading());
    try {
      await ApiWithToken({
        url: `${apiConfig.variantUrl}/${variantToDelete._id}`,
        method: "DELETE",
      });
      toast.success("Variant deleted successfully!", {
        position: "bottom-right",
      });
      setRefreshVariants((prev) => !prev);
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Failed to delete variant.", { position: "bottom-right" });
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
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Short sleeve t-shirt"
            value={values.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <Editor
            name="description"
            placeholder="Write product description here..."
            value={values.description}
            onChange={handleChange}
          >
            <Toolbar>
              <BtnBold />
              <BtnBulletList />
              <BtnNumberedList />
              <BtnItalic />
            </Toolbar>
          </Editor>
        </div>

        <div className="form-group">
          <label htmlFor="media-input">Media</label>
          <input
            id="media-input"
            ref={fileInputRef}
            type="file"
            name="media"
            accept="image/png,image/jpg,image/jpeg"
            multiple
            onChange={handleMediaChange}
          />
          <div className="media-preview">
            {values.media.map((item, index) => (
              <div key={index} className="media-preview-item">
                <img
                  src={item instanceof File ? URL.createObjectURL(item) : item}
                  alt={`preview-${index}`}
                  className="preview-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/100x100/f0f0f0/ccc?text=Error";
                  }}
                />
                <button
                  type="button"
                  className="remove-media"
                  onClick={() => removeMedia(item)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={values.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight (gms)</label>
          <input
            id="weight"
            type="number"
            name="weight"
            min="0"
            value={values.weight}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Dimensions (cm)</label>
          <input
            type="number"
            name="length"
            placeholder="Length"
            min="0"
            value={values.length}
            onChange={handleChange}
          />
          <input
            type="number"
            name="breadth"
            placeholder="Breadth"
            min="0"
            value={values.breadth}
            onChange={handleChange}
          />
          <input
            type="number"
            name="height"
            placeholder="Height"
            min="0"
            value={values.height}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            min="0"
            value={values.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category-input">Category</label>
          <div className="category-input-container">
            <input
              id="category-input"
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
            {values.categories.map((category) => (
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

        {productId && (
          <div className="form-group">
            <label>Variants</label>
            {values?.variants && values.variants.length > 0 ? (
              <div className="variants-table-container">
                <CommonTable
                  head={variantTableHead}
                  rows={values.variants}
                  type="variants"
                  onDelete={handleDeleteVariant}
                />
              </div>
            ) : (
              <p>No variants added yet.</p>
            )}
            <Link to={`/add-variant/${productId}`} className="variant-btn">
              {values?.variants?.length > 0
                ? "Manage Variants"
                : "Add Variants"}
            </Link>
          </div>
        )}

        <div className="form-group">
          <label>Pricing</label>
          <div className="pricing-contianer">
            <div>
              <input
                type="number"
                name="price"
                placeholder="Price"
                min="0"
                step="0.01"
                value={values.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="number"
                name="comparePrice"
                placeholder="Compare-at price"
                min="0"
                step="0.01"
                value={values.comparePrice}
                onChange={handleChange}
              />
            </div>
            
          </div>
          {values.comparePrice &&
            parseFloat(values.price) >= parseFloat(values.comparePrice) && (
              <p style={{ color: "red", fontSize: "0.8em", marginTop: "4px" }}>
                Price should be lower than Compare-at price.
              </p>
            )}
        </div>

        <button type="submit" className="submit-button">
          {productId ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
