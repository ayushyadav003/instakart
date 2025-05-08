import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CommonTable from "../../components/common/CommonTable";
import { ApiWithToken } from "../../services/ApiWithToken";
import { apiConfig } from "../../services/ApiConfig";
import { toast } from "react-toastify";
import "./Discount.scss";
import { discountTableHead } from "../../utils/tableHead";

const DiscountList = () => {
  const [discounts, setDiscounts] = useState([]);

  const fetchDiscounts = async () => {
    try {
      const response = await ApiWithToken({
        url: apiConfig.getDiscounts,
        method: "GET",
      });
      setDiscounts(response.data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      toast.error("Failed to fetch discounts.");
    }
  };

  const handleDelete = async (discount) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${discount.couponName}"?`
    );
    if (!confirmDelete) return;

    try {
      await ApiWithToken({
        url: `${apiConfig.deleteDiscount}/${discount._id}`,
        method: "DELETE",
      });
      toast.success("Discount deleted successfully.");
      console.log("HElelfl")
      setDiscounts((prev) =>
        prev.filter((item) => item._id !== discount._id)
      );
      
    } catch (error) {
      console.error("Error deleting discount:", error);
      toast.error("Failed to delete discount.");
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  return (
    <div className="discount-list">
      <div className="header">
        <h2>Discounts</h2>
        <Link to="/add-discount">
          <button className="add-button">Add Discount</button>
        </Link>
      </div>
      <CommonTable
        rows={discounts}
        type="discounts"
        head={discountTableHead}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DiscountList;