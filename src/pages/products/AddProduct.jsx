import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./AddProduct.scss"; // Assuming you have this SCSS file with original styles
import CommonTable from "../../components/common/CommonTable"; // Assuming component path
import { variantTableHead } from "../../utils/tableHead"; // Assuming util path
import { ApiWithToken } from "../../services/ApiWithToken"; // Assuming service path
import { apiConfig } from "../../services/ApiConfig"; // Assuming service path
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../../redux/features/userSlice"; // Assuming redux path
import axios from "axios";
import Editor, {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnNumberedList,
  Toolbar,
} from "react-simple-wysiwyg";

const AddProduct = () => {
  const navigate = useNavigate()
  const { productId } = useParams()
  const fileInputRef = useRef(null)
  const dispatch = useDispatch()

  // Default form state matching your original structure
  const defaultFormData = {
    title: "",
    description: "",
    status: "draft",
    price: "",
    comparePrice: "",
    media: [], // Holds File objects or existing URLs
    weight: "",
    length: "",
    breadth: "",
    height: "",
    quantity: 0,
    categories: [],
  };

  const [formData, setFormData] = useState(defaultFormData);
  // State to store the initial form data for comparison on update
  const [initialFormData, setInitialFormData] = useState(null);
  const [productData, setProductData] = useState(null); // Stores full fetched product data
  const [categoryInput, setCategoryInput] = useState("");
  const [refreshVariants, setRefreshVariants] = useState(false);

  // --- Fetch Product Data Effect ---
  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          dispatch(startLoading()); // Use Redux loading state
          console.log(`Fetching product with ID: ${productId}`);
          const apiOptions = {
            url: `${apiConfig.getProductById}/${productId}`, // Use your actual config
            method: "GET",
          };
          const response = await ApiWithToken(apiOptions); // Your actual API call
          console.log("API Response:", response.data);

          if (response?.status === 200) {
            const product = response.data;
            setProductData(product); // Store full product data

            // Prepare the data structure matching formData
            const fetchedFormData = {
              title: product.title || "",
              description: product.description || "",
              status: product.status || "draft",
              price: product.price || "",
              comparePrice: product.comparePrice || "",
              media: product.mediaUrls || [], // Store URLs initially
              weight: product.weight || "",
              length: product.length || "",
              breadth: product.breadth || "",
              height: product.height || "",
              quantity: product.quantity || 0,
              categories: product.categories || [],
            };

            setFormData(fetchedFormData);
            setInitialFormData(fetchedFormData); // <-- Store the initial state for comparison

            console.log("Initial form data set:", fetchedFormData);
          } else {
            toast.error("Failed to fetch product data.", {
              position: "bottom-right",
            });
          }
        } catch (error) {
          console.error('Error fetching product:', error)
          toast.error('Failed to fetch product data.', {
            position: 'bottom-right',
          })
        } finally {
          dispatch(stopLoading()); // Stop loading
        }
      } else {
        // Reset form for adding a new product
        setFormData(defaultFormData);
        setInitialFormData(null); // No initial data for new product
        setProductData(null);
      }
    };
    fetchProduct();
  }, [productId, refreshVariants, dispatch]); // Dependencies

  // --- Input Change Handler ---
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      // Append new files to the media array
      const currentMedia = formData.media; // Can contain URLs and Files
      const newFiles = Array.from(files);
      setFormData((prevData) => ({
        ...prevData,
        // Keep existing URLs/Files and add new Files
        media: [...currentMedia, ...newFiles],
      }));
    } else {
      // Handle standard inputs
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    console.log("Form data changed:", name, value);
  };

  // --- Description Editor Change Handler ---
  // Separate handler needed as Editor's onChange might pass value differently
  const handleDescriptionChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      description: e.target.value, // Access the HTML content from event
    }));
    console.log("Description changed:", e.target.value);
  };

  // --- Category Handlers ---
  const handleCategoryChange = (e) => {
    setCategoryInput(e.target.value)
  }

  const handleCategoryAdd = () => {
    const newCategory = categoryInput.trim();
    if (newCategory && !formData.categories.includes(newCategory)) {
      setFormData((prevData) => ({
        ...prevData,
        categories: [...prevData.categories, newCategory],
      }));
      setCategoryInput(""); // Clear input after adding
    }
  }

  const handleCategoryRemove = (categoryToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      categories: prevData.categories.filter((c) => c !== categoryToRemove),
    }));
  };

  // --- Media Removal Handler ---
  const removeMedia = (itemToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      // Filter out the specific item (URL string or File object)
      media: prevData.media.filter((mediaItem) => mediaItem !== itemToRemove),
    }));
    // Optionally reset file input if a File object was removed
    // Note: This clears the *entire* input, not just the removed file.
    if (itemToRemove instanceof File && fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    console.log("Media removed:", itemToRemove);
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit triggered. Current formData:", formData);
    if (productId && initialFormData) {
      console.log("Comparing with initialFormData:", initialFormData);
    }

    // --- Validation ---
    if (!formData.title || !formData.price) {
      toast.error('Title and Price are required.', {
        position: 'bottom-right',
      })
      return
    }
    if (
      formData.comparePrice &&
      parseFloat(formData.price) >= parseFloat(formData.comparePrice)
    ) {
      toast.error('Price must be less than Compare-at price.', {
        position: 'bottom-right',
      })
      return
    }

    // --- Check for Changes (only for updates) ---
    if (productId && initialFormData) {
      // Separate current state's files and URLs
      const currentFiles = formData.media.filter(
        (item) => item instanceof File
      );
      const currentUrls = formData.media.filter(
        (item) => typeof item === "string"
      );

      // Initial state only contains URLs (or is empty)
      const initialUrls = initialFormData.media.filter(
        (item) => typeof item === "string"
      );

      // Create comparable versions of the form data (excluding Files in media)
      // Sort URLs arrays for consistent JSON string comparison
      const comparableCurrentData = {
        ...formData,
        media: [...currentUrls].sort(),
      };
      const comparableInitialData = {
        ...initialFormData,
        media: [...initialUrls].sort(),
      };

      // Compare stringified data (excluding new files)
      const hasDataChanged =
        JSON.stringify(comparableCurrentData) !==
        JSON.stringify(comparableInitialData);
      // Check if new files were added (exist in current state but not initial)
      const hasFilesAdded = currentFiles.length > 0;

      console.log("hasDataChanged (excluding new files):", hasDataChanged);
      console.log("hasFilesAdded:", hasFilesAdded);

      // If no data fields changed AND no new files were added, then nothing changed
      if (!hasDataChanged && !hasFilesAdded) {
        toast.info("No changes detected.", { position: "bottom-right" });
        console.log("No changes detected, returning.");
        return; // Stop submission
      }
    }

    // --- Proceed with Submission (Add or Update) ---
    try {
      dispatch(startLoading()); // Start loading indicator
      console.log("Proceeding with submission...");

      // --- Upload New Media Files (if any) ---
      const newFilesToUpload = formData.media.filter(
        (item) => item instanceof File
      );
      const existingMediaUrls = formData.media.filter(
        (item) => typeof item === "string"
      );
      let uploadedNewUrls = [];

      if (newFilesToUpload.length > 0) {
        console.log("Uploading new files:", newFilesToUpload);
        // Use Promise.all to upload all new files concurrently
        uploadedNewUrls = await Promise.all(
          newFilesToUpload.map(async (file) => {
            // --- Your Cloudinary/Upload logic ---
            const uploadData = new FormData();
            uploadData.append("file", file, file.name);
            uploadData.append("upload_preset", "instakart"); // Use your preset

            const response = await axios.post(
              "https://api.cloudinary.com/v1_1/dobzi0uvb/image/upload", // Use your Cloudinary URL
              uploadData
            );
            return response.data.secure_url; // Return the URL
            // --- End Upload Logic ---
          })
        );
        console.log("Uploaded new URLs:", uploadedNewUrls);
      }

      // Combine existing URLs and newly uploaded URLs
      const finalMediaUrls = [...existingMediaUrls, ...uploadedNewUrls];

      // Prepare data payload for API
      const productDataToSend = {
        ...formData, // Spread current form data
        media: undefined, // Remove the mixed media array
        mediaUrls: finalMediaUrls, // Send only the final URLs
        description: formData.description, // Ensure description from state is included
      };
      delete productDataToSend.media; // Clean up just in case

      console.log("Data being sent to API:", productDataToSend);

      let apiOptions;
      let successMessage;

      // --- Determine API endpoint (Add vs Update) ---
      if (productId) {
        console.log(`Configuring UPDATE API call`);
        apiOptions = {
          url: `${apiConfig.updateProduct}/${productId}`, // Your actual update endpoint
          method: "PUT",
          data: productDataToSend,
        };
        successMessage = "Product updated successfully!";
      } else {
        console.log(`Configuring ADD API call`);
        apiOptions = {
          url: apiConfig.productUrl, // Your actual add endpoint
          method: "POST",
          data: productDataToSend,
        };
        successMessage = "Product added successfully!";
      }

      // --- Make the API Call ---
      console.log("Making API call with options:", apiOptions);
      await ApiWithToken(apiOptions); // Your actual API call function
      console.log("API call successful.");
      // --- End API Call ---

      toast.success(successMessage, { position: "bottom-right" });
      navigate("/products"); // Navigate on success
    } catch (error) {
      console.error("Error submitting form:", error);
      // Provide more specific error feedback if possible
      const errorMsg =
        error.response?.data?.message || "Operation failed. Please try again.";
      toast.error(errorMsg, { position: "bottom-right" });
    } finally {
      dispatch(stopLoading()); // Stop loading indicator
    }
  }

  // --- Variant Deletion Handler ---
  const handleDeleteVariant = async (variantToDelete) => {
    if (!productData || !variantToDelete) return;
    console.log("Attempting to delete variant:", variantToDelete);
    try {
      dispatch(startLoading())
      const apiOptions = {
        url: `${apiConfig.variantUrl}/${variantToDelete._id}`, // Your actual delete endpoint
        method: "DELETE",
      };
      console.log("Making DELETE variant API call:", apiOptions);
      await ApiWithToken(apiOptions); // Actual API call

      toast.success("Variant deleted successfully!", {
        position: "bottom-right",
      });
      setRefreshVariants((prev) => !prev); // Trigger a refresh of product data
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Failed to delete variant.", { position: "bottom-right" });
    } finally {
      dispatch(stopLoading())
    }
  }

  // --- JSX Structure based on your original code ---
  return (
    <div className="add-product-container">
      {" "}
      {/* Original main container class */}
      <ToastContainer limit={1} position="bottom-right" autoClose={3000} />
      <div className="header-container">
        {" "}
        {/* Original header class */}
        <Link to="/products">
          <ArrowBackIcon />
        </Link>
        <h2 className="header">
          {productId ? 'Update Product' : 'Add Product'}
        </h2>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          {" "}
          {/* Original form group class */}
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Short sleeve t-shirt"
            value={formData.title}
            onChange={handleChange}
            required // Added required based on validation logic
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <Editor
            name="description" // Name might not be strictly needed if using handleDescriptionChange
            placeholder="Write product description here..."
            // className="description-editor" // Add back if you have specific styles
            value={formData.description}
            onChange={handleDescriptionChange} // Use specific handler for editor
          >
            <Toolbar>
              <BtnBold />
              <BtnBulletList />
              <BtnNumberedList />
              <BtnItalic />
            </Toolbar>
          </Editor>
        </div>

        {/* Media */}
        <div className="form-group">
          <label>Media</label>
          <input
            ref={fileInputRef}
            type="file"
            name="media" // Keep name for consistency, though handled separately
            accept="image/png,image/jpg,image/jpeg" // Corrected accept attribute
            multiple
            onChange={handleChange} // Use standard handler to add files to state
          />
          {/* Media Preview using original class names */}
          <div className="media-preview">
            {formData.media.map((item, index) => (
              <div key={index} className="media-preview-item">
                <img
                  src={item instanceof File ? URL.createObjectURL(item) : item}
                  alt={`preview-${index}`}
                  className="preview-image" // Your original preview image class
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "[https://placehold.co/100x100/f0f0f0/ccc?text=Error](https://placehold.co/100x100/f0f0f0/ccc?text=Error)";
                  }} // Basic fallback
                />
                <button
                  type="button"
                  className="remove-media" // Your original remove button class
                  onClick={() => removeMedia(item)} // Pass the item (File or URL)
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>

        {/* Weight */}
        <div className="form-group">
          <label>Weight (gms)</label>
          <input
            type="number"
            name="weight"
            min="0" // Good practice to add min
            value={formData.weight}
            onChange={handleChange}
          />
        </div>

        {/* Dimensions */}
        <div className="form-group">
          <label>Dimensions (cm)</label>
          {/* Assuming these were originally stacked or side-by-side based on your SCSS */}
          <input
            type="number"
            name="length"
            placeholder="Length"
            min="0"
            value={formData.length}
            onChange={handleChange}
          />
          <input
            type="number"
            name="breadth"
            placeholder="Breadth"
            min="0"
            value={formData.breadth}
            onChange={handleChange}
          />
          <input
            type="number"
            name="height"
            placeholder="Height"
            min="0"
            value={formData.height}
            onChange={handleChange}
          />
        </div>

        {/* Quantity */}
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            min="0" // Good practice
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category</label>
          {/* Category Input & Add Button */}
          <div className="category-input-container">
            {" "}
            {/* Original class */}
            <input
              type="text"
              value={categoryInput}
              onChange={handleCategoryChange}
              placeholder="Enter category name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleCategoryAdd()
                }
              }}
            />
            {/* You might need an explicit "Add" button here if your original design had one */}
            {/* <button type="button" onClick={handleCategoryAdd}>Add</button> */}
          </div>
          {/* Category Tags */}
          <div className="category-tags-container">
            {" "}
            {/* Original class */}
            {formData.categories.map((category) => (
              <div key={category} className="category-tag">
                {" "}
                {/* Original class */}
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

        {/* Variants Section (Conditional) */}
        {
          productId ? (
            <div className="form-group">
              {" "}
              {/* Wrap in form-group like others */}
              <label>Variants</label>
              {productData?.variants && productData.variants.length > 0 ? (
                // Assuming you had a container class for the table
                <div className="variants-table-container">
                  <CommonTable // Use your actual CommonTable component
                    head={variantTableHead} // Use your actual head config
                    rows={productData.variants}
                    type="variants"
                    onDelete={handleDeleteVariant} // Pass delete handler
                  />
                </div>
              ) : (
                <p>No variants added yet.</p> // Simple text if no variants
              )}
              {/* Link to add/manage variants */}
              <Link to={`/add-variant/${productId}`} className="variant-btn">
                {" "}
                {/* Original class */}
                {productData?.variants?.length > 0
                  ? "Manage Variants"
                  : "Add Variants"}
              </Link>
            </div>
          ) : null /* Render nothing if not updating */
        }

        {/* Pricing */}
        <div className="form-group">
          <label>Pricing</label>
          <div className="pricing-contianer">
            {" "}
            {/* Original class */}
            <input
              type="number"
              name="price"
              value={formData.price}
              placeholder="Price"
              min="0"
              step="0.01" // Allow decimals
              onChange={handleChange}
              required // Added required based on validation
            />
            <input
              type="number"
              name="comparePrice"
              placeholder="Compare-at price"
              min="0"
              step="0.01"
              value={formData.comparePrice}
              onChange={handleChange}
            />
          </div>
          {/* Optional: Inline validation message based on original structure */}
          {formData.comparePrice &&
            parseFloat(formData.price) >= parseFloat(formData.comparePrice) && (
              <p style={{ color: "red", fontSize: "0.8em", marginTop: "4px" }}>
                Price should be lower than Compare-at price.
              </p>
            )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          {" "}
          {/* Original class */}
          {productId ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  )
}

export default AddProduct
