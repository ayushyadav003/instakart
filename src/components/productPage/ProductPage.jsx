import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import './ProductPage.scss'
import { useDispatch } from 'react-redux'
import { apiConfig } from '../../services/ApiConfig'
import { ApiWithToken } from '../../services/ApiWithToken'
import { startLoading, stopLoading } from '../../redux/features/userSlice'

function ProductPage() {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const [productData, setProductData] = useState({})
  const [quatity, setQuantity] = useState(1)

  const getProduct = async () => {
    try {
      dispatch(startLoading())
      const apiOptions = {
        url: `${apiConfig.getProductById}/${productId}`,
        method: 'GET',
        params: {
          id: productId,
        },
      }
      const response = await ApiWithToken(apiOptions)
      if (response?.status === 200) {
        setProductData(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(stopLoading())
    }
  }
  const addToCart = () => {
    // const cartData
  }

  useEffect(() => {
    getProduct()
  }, [])

  return (
    <div className="product-page">
      <div className="product-image">
        <img
          src={productData?.mediaUrls?.length > 0 && productData?.mediaUrls[0]}
          alt={productData.name}
        />
      </div>
      <div className="product-details">
        <h1>{productData?.title}</h1>
        <p className="product-description">{productData.description}</p>
        <div className="product-price">
          <span className="price">{productData.price}</span>
          <span className="compare-price">{productData.comparePrice}</span>
        </div>
        <div className="product-buttons">
          <button className="buy-button">Buy Now</button>
          <button className="cart-button" onClick={()=> addToCart()}>
            <ShoppingCartOutlinedIcon /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
