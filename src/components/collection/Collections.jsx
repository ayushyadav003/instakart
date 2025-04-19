import React, { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import './CollectionPage.scss'
import { startLoading, stopLoading } from '../../redux/features/userSlice'
import { apiConfig } from '../../services/ApiConfig'
import { ApiWithToken } from '../../services/ApiWithToken'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import StoreLayout from '../../layouts/store/StoreLayout'

const category = [
  'Shirts',
  'T-shirts',
  'Jeans',
  'Pants',
  'Jackets',
  'Shoes',
  'Under Garments',
]
const CollectionPage = () => {
  const { id } = useParams() // Get store ID from URL
  const navigate = useNavigate()
  const [collections, setCollections] = useState([])
  const dispatch = useDispatch()
  const location = useLocation()
  const currentPath = location?.pathname.split('/')
  const businessName = currentPath[2]

  const handleProductClick = (productId) => {
    console.log(productId)
    navigate(`/${businessName}/${productId}`) // Navigate to Product Page
  }

  const getCollections = async () => {
    try {
      dispatch(startLoading())
      const apiOptions = {
        url: apiConfig.getProductList,
        method: 'POST',
        data: { businessName: currentPath[2] },
      }
      const response = await ApiWithToken(apiOptions)
      if (response?.data?.statusCode === 200) {
        setCollections(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(stopLoading())
    }
  }

  const addToCart = (newProduct) => {
    const existingCart = JSON.parse(localStorage.getItem('cartProducts')) || []

    const productIndex = existingCart.findIndex(
      (item) => item._id === newProduct._id,
    )

    if (productIndex !== -1) {
      existingCart[productIndex].quantity += 1
    } else {
      existingCart.push({ ...newProduct, quantity: 1 })
    }

    localStorage.setItem('cartProducts', JSON.stringify(existingCart))

    console.log('Product added to cart:', newProduct)
  }

  useEffect(() => {
    if (businessName) {
      getCollections()
    }
  }, [businessName])

  return (
    <div>
      <StoreLayout>
        <div className="collection-page">
          <div className="categoryWrapper">
            <h4>Category</h4>
            <div className="categories">
              {category.map((data, i) => (
                <div key={i}>
                  <input type="checkbox" />
                  <p>{data}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="productWrapper">
            {collections?.length > 0 &&
              collections.map((product) => (
                <div key={product.id} className="productCard">
                  <div
                    className="imageContainer"
                    onClick={() => handleProductClick(product?._id)}
                  >
                    <img
                      src={product.mediaUrls[0]}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>
                  <div className="productDetails">
                    <div
                      className="inner"
                      onClick={() => handleProductClick(product?._id)}
                    >
                      <p className="product-name">{product.title}</p>
                      <h5 className="product-price">₹{product.price}</h5>
                    </div>

                    <p className="description">{product.description}</p>

                    <div className="buttonContainer">
                      <button className="buyButton">Buy Now</button>
                      <button
                        className="cartButton"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </StoreLayout>
    </div>
  )
}

export default CollectionPage
