import React, { useState, useEffect, useRef } from "react";
import "../../components/styles/Order.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import axios from "axios";
import { Delete } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [paymentForm, setPaymentForm] = useState({
    subTotal: 0.0,
    totalDiscounts: 0.0,
    total: 0.0,
  });
  const searchRef = useRef(null);
  const containerRef = useRef(null);
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const handleSearchProduct = async (inputSearchVal) => {
    setSearchTerm(inputSearchVal);
    if (inputSearchVal !== "") {
      try {
        const searchResponse = await axios.get(
          "http://localhost:5000/api/v1/products/search",
          {
            params: { q: inputSearchVal },
          }
        );
        setSuggestions(searchResponse.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products.", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionItem = (isChecked, product) => {
    if (isChecked) {
      setOrderItems((prev) => [
        ...prev,
        {
          id: product._id,
          title: product.title,
          img: product.mediaUrls[0],
          price: product.price,
          comparePrice: product.comparePrice,
        },
      ]);
    } else {
      setOrderItems((prev) => prev.filter((item) => item.id !== product._id));
    }
  };

  const handleDeleteItem = (productId) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== productId));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const subTotal = orderItems.reduce(
      (acc, item) => acc + item.comparePrice,
      0
    );
    const totalDiscounts = orderItems.reduce(
      (acc, item) => acc + (item.comparePrice - item.price),
      0
    );
    const total = subTotal - totalDiscounts;

    setPaymentForm({
      subTotal,
      totalDiscounts,
      total,
    });
  }, [orderItems]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!customer.firstName) {
      newErrors.firstName = "First Name is required";
      isValid = false;
    }
    if (!customer.lastName) {
      newErrors.lastName = "Last Name is required";
      isValid = false;
    }
    if (!customer.mobileNumber) {
      newErrors.mobileNumber = "Mobile Number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(customer.mobileNumber)) {
      newErrors.mobileNumber = "Mobile Number must be 10 digits";
      isValid = false;
    }
    if (!customer.email) {
      newErrors.email = "Email is required";
      isValid = false;
    }
    if (!customer.addressLine1) {
      newErrors.addressLine1 = "Address Line 1 is required";
      isValid = false;
    }
    if (!customer.pincode) {
      newErrors.pincode = "Pincode is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(customer.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateOrder = async () => {
    if (orderItems.length === 0) {
      toast.error("Please add items to the order.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    if (validateForm()) {
      try {
        const customerResponse = await axios.post(
          "http://localhost:5000/api/v1/customers",
          customer
        );

        const productIds = orderItems.map((item) => item.id);
        const orderResponse = await axios.post(
          "http://localhost:5000/api/v1/orders",
          {
            customerDetails: customerResponse.data,
            products: productIds,
            payment: paymentForm,
          }
        );

        toast.success("Order created successfully!");
        console.log("Order created successfully:", orderResponse.data);

        setOrderItems([]);
        setCustomer({
          firstName: "",
          lastName: "",
          mobileNumber: "",
          email: "",
          addressLine1: "",
          addressLine2: "",
          pincode: "",
        });
        setSearchTerm("");
        setSuggestions([]);
      } catch (error) {
   
        toast.error(
          "Failed to create order. Please check your data and try again."
        );
        console.error("Error creating order:", error);
      }
    }
  };

  return (
    <div className="add-order-container">
      <div className="header-container">
        <Link to="/orders">
          <ArrowBackIcon />
        </Link>
        <h2 className="heading">Create Order</h2>
      </div>
      <ToastContainer />

      <div className="section">
        <h3>Products</h3>
        <div className="input-group" ref={containerRef}>
          <input
            ref={searchRef}
            className="search-input"
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => handleSearchProduct(e.target.value)}
          />
          <button className="remove-all-btn" onClick={() => setOrderItems([])}>
            Remove all products
          </button>

          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((product) => (
                <div className="suggestion-item" key={product._id}>
                  <input
                    onChange={(e) =>
                      handleSuggestionItem(e.target.checked, product)
                    }
                    type="checkbox"
                    id={product._id}
                    checked={orderItems.some((item) => item.id === product._id)}
                  />
                  <label htmlFor={product._id}>
                    <img src={product.mediaUrls[0]} alt={product.title} />
                    {product.title}
                  </label>
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="section order-items">
        <h3>Order Items</h3>
        {orderItems.length > 0 ? (
          <ul className="order-items-list">
            {orderItems.map((item) => (
              <li className="order-item" key={item.id}>
                <img src={item.img} alt={item.title} />
                <p>
                  {" "}
                  {item.title}-<span className="price"> ₹{item.price}</span>
                </p>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Delete fontSize="small" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items selected.</p>
        )}
      </div>

      <div className="section payment">
        <h3>Payment</h3>
        <div className="payment-details">
          <div className="row">
            <span>Subtotal</span>
            <span>₹{paymentForm.subTotal}</span>
          </div>
          <div className="row">
            <span>Total discount</span>
            <span>₹{paymentForm.totalDiscounts}</span>
          </div>
          <div className="row total">
            <span>Total</span>
            <span>₹{paymentForm.total}</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>Customer</h3>
        <div className="customer-form">
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={customer.firstName}
              onChange={handleCustomerChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={customer.lastName}
              onChange={handleCustomerChange}
            />
          </div>
          <div>
            <input
              type="number"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={customer.mobileNumber}
              onChange={handleCustomerChange}
              onInput={(e) => {
                // Remove any non-numeric characters
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                // Truncate to 10 digits
                if (e.target.value.length > 10) {
                  e.target.value = e.target.value.slice(0, 10);
                }
              }}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={customer.email}
              onChange={handleCustomerChange}
            />
          </div>

          <div>
            <input
              type="text"
              name="addressLine1"
              placeholder="Address Line 1"
              value={customer.addressLine1}
              onChange={handleCustomerChange}
            />
            <input
              type="text"
              name="addressLine2"
              placeholder="Address Line 2"
              value={customer.addressLine2}
              onChange={handleCustomerChange}
            />
          </div>

          <input
            type="number"
            name="pincode"
            placeholder="Pincode"
            minLength={6}
            maxLength={6}
            value={customer.pincode}
            onChange={handleCustomerChange}
            onInput={(e) => {
              if (e.target.value.length > 6) {
                e.target.value = e.target.value.slice(0, 6);
              }
            }}
          />
        </div>
      </div>

      <button className="create-order-button" onClick={handleCreateOrder}>
        Create order
      </button>
    </div>
  );
};

export default AddOrder;
