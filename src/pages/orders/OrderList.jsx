import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CommonTable from "../../components/common/CommonTable";
import "../products/ProductList.scss";
import { orderTableHead } from "../../utils/tableHead";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Date Formatting Function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    console.log(`${day}/${month}/${year}`, "date");
    return `${day}/${month}/${year}`;
  };

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/orders");
        const formattedOrders = response.data.map((order) => ({
          ...order,
          orderDate: formatDate(order.orderDate), // Assuming createdAt is the order date
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(
          "Failed to load orders. Please check your network connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Delete Order
  const onDelete = async (rowItem) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete order #${rowItem._id}?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/v1/orders/${rowItem._id}`);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== rowItem._id)
      );
      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("Failed to delete the order. Please try again.");
    }
  };

  if (loading) return <p>Loading Orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="table-list">
      <div className="header">
        <h2>Orders</h2>
        <Link to="/add-order">
          <button className="add-button">Add Order</button>
        </Link>
      </div>
      <CommonTable
        onDelete={onDelete}
        head={orderTableHead}
        rows={orders}
        type="orders"
      />
    </div>
  );
}
