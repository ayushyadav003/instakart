import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CommonTable from '../../components/common/CommonTable';
import { productTableHead } from '../../utils/tableHead';
import './ProductList.scss';
import { startLoading, stopLoading } from '../../redux/features/userSlice';
import { ApiWithToken } from '../../services/ApiWithToken';
import { apiConfig } from '../../services/ApiConfig';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  const onDelete = async (rowItem) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${rowItem.title}"?`
    );
    if (!confirmDelete) return;

    try {
      dispatch(startLoading());
      const apiOptions = {
        url: `${apiConfig.productUrl}/${rowItem._id}`, // Use correct API endpoint
        method: 'DELETE',
      };
      await ApiWithToken(apiOptions);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== rowItem._id)
      );
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete the product. Please try again.');
    } finally {
      dispatch(stopLoading());
    }
  };

  // Fetch Products from API
  const fetchProducts = async () => {
    try {
      dispatch(startLoading());
      const apiOptions = {
        url: apiConfig.getProductList,
        method: 'POST', // Or 'GET', depending on your API
      };
      const response = await ApiWithToken(apiOptions);

      if (response?.status === 200) {
        const formattedProducts = response?.data?.map((product) => ({
          ...product,
          image:
            product.mediaUrls?.length > 0
              ? product.mediaUrls[0]
              : '/assets/images/default.png',
        }));

        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products.");
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="table-list">
      <div className="header">
        <h2>Products</h2>
        <Link to="/add-product">
          <button className="add-button">Add Product</button>
        </Link>
      </div>

      <CommonTable
        onDelete={onDelete}
        head={productTableHead}
        rows={products}
        type="products"
      />
    </div>
  );
}
