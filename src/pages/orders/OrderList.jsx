import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CommonTable from "../../components/common/CommonTable";
import "../products/ProductList.scss";
import { orderTableHead } from "../../utils/tableHead";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete the order. Please try again.");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/orders");
        setOrders(response?.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="table-list">
      <div className="header">
        <h2>Orders</h2>
        <Link to="/add-order">
          <button className="add-button">Add Order</button>
        </Link>
      </div>
      {loading ? (
        <p>Loading Orders...</p>
      ) : (
        <CommonTable
          onDelete={onDelete}
          head={orderTableHead}
          rows={orders}
          type="orders"
        />
      )}
    </div>
  );
}
