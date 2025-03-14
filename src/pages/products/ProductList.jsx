import React from "react";
import ProductItem from "./ProductItem";
import "./ProductList.scss";
import CommonTable from "../../components/common/CommonTable";
import { productTableHead } from "../../utils/tableHead";

const products = [
  {
    id: 1,
    image: "/assets/images/car.jpeg",
    title: "SAY MY - 2nd EP Album",
    status: "Draft",
    inventory: "0 in stock for 2 variants",
    salesChannels: 11,
    category: "Uncategorized",
    type: "Albums",
    vendor: "StyleKorean",
  },
  {
    id: 2,
    image: "/assets/images/car-1.jpeg",
    title: "HOSHI X WOOZI - 1st Single Album 'BEAM' KiT Ver.",
    status: "Draft",
    inventory: "0 in stock",
    salesChannels: 11,
    category: "Music & Sound Recordings",
    type: "Albums",
    vendor: "StyleKorean",
  },
  // Add more products as needed
];

export default function ProductList() {
  return (
    <div className="product-list">
      <div className="header">
        <h2>Products</h2>
        <button className="add-product">Add Product</button>
      </div>
      <CommonTable head={productTableHead} rows={products}  type={"products"}/>

      {/* <div className="filters">
        <button className="active">All</button>
        <button>Active</button>
        <button>Draft</button>
        <button>Archived</button>
      </div>

      <div className="table">
        <div className="table-header">
          <span>
            <input type="checkbox" />
          </span>
          <span>Product</span>
          <span>Status</span>
          <span>Inventory</span>
          <span>Type</span>
          <span>Vendor</span>
        </div>
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div> */}
    </div>
  );
}
