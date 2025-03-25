import React from "react";
import { Link } from "react-router-dom";

export default function ProductItem({ product }) {
  const handleCheckboxClick = (event) => {
    event.stopPropagation();
  };

  return (
    <Link to="/add-product" className="product-item">
      <span className="product-checkbox">
        <input type="checkbox" onClick={handleCheckboxClick} />
      </span>
      <div className="product-info">
        <img src={product.image} alt={product.name} />
        <span className="product-title">{product.name}</span>
      </div>
      <span className="status">{product.status}</span>
      <span className="inventory">{product.inventory}</span>
      <span>{product.type}</span>
      <span>{product.vendor}</span>
    </Link>
  );
}
