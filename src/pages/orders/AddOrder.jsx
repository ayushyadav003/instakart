import React, { useState, useEffect, useRef } from "react";
import "../../components/styles/Order.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Delete } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddOrder = () => {
  const { orderId } = useParams(); // Get orderId from route
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [paymentForm, setPaymentForm] = useState({
    subTotal: 0.0,
    totalDiscounts: 0.0,
    total: 0.0,
    paymentMethod: "Cash on Delivery", // Default value
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
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false); // Track if it's an update

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
        toast.error("Error fetching products. Please try again.", {
          position: "bottom-right",
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
      ...paymentForm,
      subTotal,
      totalDiscounts,
      total,
    });
  }, [orderItems]);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handlePaymentChange = (e) => {
    setPaymentForm({ ...paymentForm, paymentMethod: e.target.value });
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

    if (!isValid) {
      // Display specific error messages using toast
      if (newErrors.firstName) {
        toast.error(newErrors.firstName, { position: "bottom-right" });
      } else if (newErrors.lastName) {
        toast.error(newErrors.lastName, { position: "bottom-right" });
      } else if (newErrors.mobileNumber) {
        toast.error(newErrors.mobileNumber, { position: "bottom-right" });
      } else if (newErrors.email) {
        toast.error(newErrors.email, { position: "bottom-right" });
      } else if (newErrors.addressLine1) {
        toast.error(newErrors.addressLine1, { position: "bottom-right" });
      } else if (newErrors.pincode) {
        toast.error(newErrors.pincode, { position: "bottom-right" });
      }
    }
    return isValid;
  };

  const handleCreateOrder = async () => {
    if (orderItems.length === 0) {
      toast.error("Please add items to the order", {
        position: "bottom-right",
      });
      return;
    }

    if (validateForm()) {
      setLoading(true);
      try {
        let customerResponse;

        // Fetch customer by phone number
        const phoneResponse = await axios.get(
          `http://localhost:5000/api/v1/customers/getSingleCustomer`,
          {
            params: { identifier: customer.mobileNumber },
          }
        );

        console.log(phoneResponse, "phoneResponse");

        if (phoneResponse.data) {
          console.log("Customer found:", phoneResponse.data);
          customerResponse = await axios.put(
            `http://localhost:5000/api/v1/customers/${phoneResponse.data._id}`,
            customer
          );
        } else {
          console.log("No existing customer found, creating a new one.");
          customerResponse = await axios.post(
            "http://localhost:5000/api/v1/customers",
            customer
          );
        }

        const productIds = orderItems.map((item) => item.id);
        const orderData = {
          customerDetails: customerResponse.data.customer,
          products: productIds,
          paymentMethod: paymentForm.paymentMethod,
          totalAmount: paymentForm.total, // Ensure this is sent
        };

        let orderResponse;
        if (orderId) {
          orderResponse = await axios.put(
            `http://localhost:5000/api/v1/orders/${orderId}`,
            orderData
          );
          toast.success("Order updated successfully!", {
            position: "bottom-right",
          });
        } else {
          orderResponse = await axios.post(
            "http://localhost:5000/api/v1/orders",
            orderData
          );
          toast.success("Order created successfully!", {
            position: "bottom-right",
          });
        }

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
        navigate("/orders");
      } catch (error) {
        console.error("Error creating or updating order:", error);
        toast.error("Failed to create or update order. Please try again.", {
          position: "bottom-right",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        setIsUpdate(true);
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:5000/api/v1/orders/${orderId}`
          );
          const order = response.data;
          // console.log(order, "order");
          // Assuming the API returns customer details nested as customerDetails
          const {
            customer: customerDetails,
            products,
            paymentMethod,
            totalAmount,
          } = order;

          console.log(
            customerDetails,
            products,
            paymentMethod,
            totalAmount,
            "bha"
          );

          // Populate customer form
          setCustomer({
            firstName: customerDetails.firstName || "",
            lastName: customerDetails.lastName || "",
            mobileNumber: customerDetails.mobileNumber || "",
            email: customerDetails.email || "",
            addressLine1: customerDetails.addressLine1 || "",
            addressLine2: customerDetails.addressLine2 || "",
            pincode: customerDetails.pincode || "",
          });

          // Populate order items.  Map product IDs to a simplified structure.
          const fetchedOrderItems = products.map((product) => ({
            id: product._id,
            title: product.title,
            img: product.mediaUrls[0], // Or however you want to get the image
            price: product.price,
            comparePrice: product.comparePrice,
          }));
          setOrderItems(fetchedOrderItems);

          // Populate payment form
          setPaymentForm({
            ...paymentForm,
            paymentMethod: paymentMethod || "Cash on Delivery", // Or default
            total: totalAmount,
          });
          setSearchTerm("");
          setSuggestions([]);
        } catch (error) {
          console.error("Error fetching order:", error);
          toast.error("Failed to load order details.", {
            position: "bottom-right",
          });
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  return (
    <div className="add-order-container">
      <div className="header-container">
        <Link to="/orders">
          <ArrowBackIcon />
        </Link>
        <h2 className="heading">{orderId ? "Update Order" : "Create Order"}</h2>
      </div>
      <ToastContainer limit={1} position="bottom-right" autoClose={3000} />

      <div className="section">
        <h3>Products</h3>
        <div className="input-group" ref={containerRef}>
          <input
            ref={searchRef}
            className="search-input"
            type="text"
            placeholder="Search products *"
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
              placeholder="First Name *"
              value={customer.firstName}
              onChange={handleCustomerChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name *"
              value={customer.lastName}
              onChange={handleCustomerChange}
            />
          </div>
          <div>
            <input
              type="number"
              name="mobileNumber"
              placeholder="Mobile Number *"
              value={customer.mobileNumber}
              onChange={handleCustomerChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                if (e.target.value.length > 10) {
                  e.target.value = e.target.value.slice(0, 10);
                }
              }}
            />

            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={customer.email}
              onChange={handleCustomerChange}
            />
          </div>

          <div>
            <input
              type="text"
              name="addressLine1"
              placeholder="Address Line 1 *"
              value={customer.addressLine1}
              onChange={handleCustomerChange}
            />
            <input
              type="text"
              name="addressLine2"
              placeholder="Address Line 2 "
              value={customer.addressLine2}
              onChange={handleCustomerChange}
            />
          </div>

          <div>
            <input
              type="number"
              name="pincode"
              placeholder="Pincode *"
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
            <select
              name="paymentMethod"
              value={paymentForm.paymentMethod}
              onChange={handlePaymentChange}
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Online Payment">Online Payment</option>
            </select>
          </div>
        </div>
      </div>

      <button
        className="create-order-button"
        onClick={handleCreateOrder}
        disabled={loading}
      >
        {loading
          ? "Creating Order..."
          : orderId
          ? "Update Order"
          : "Create order"}
      </button>
    </div>
  );
};

export default AddOrder;
