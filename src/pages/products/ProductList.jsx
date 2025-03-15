import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CommonTable from "../../components/common/CommonTable";
import { productTableHead } from "../../utils/tableHead";
import "./ProductList.scss";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const onDelete = async (rowItem) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${rowItem.title}"?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/v1/products/${rowItem._id}`
      );
      
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== rowItem._id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product. Please try again.");
    }
  };

  // Fetch Products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/products"
        );
        console.log(response.data, "API Response");

        const formattedProducts = response.data.map((product) => ({
          ...product,
          image:
            product.mediaUrls?.length > 0
              ? product.mediaUrls[0]
              : "/assets/images/default.png",
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-list">
      <div className="header">
        <h2>Products</h2>
        <Link to="/add-product">
          <button className="add-product">Add Product</button>
        </Link>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <CommonTable
          onDelete={onDelete}
          head={productTableHead}
          rows={products}
          type="products"
        />
      )}
    </div>
  );
}
