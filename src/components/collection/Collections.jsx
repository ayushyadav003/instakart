import React, { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import './CollectionPage.scss'
import { startLoading, stopLoading } from '../../redux/features/userSlice'
import { apiConfig } from '../../services/ApiConfig'
import { ApiWithToken } from '../../services/ApiWithToken'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

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

  useEffect(() => {
    if(businessName){
      getCollections()
    }
  }, [businessName])

  return (
    <div className="collection-page">
      <div className="collectionHeader">
        <img />
      </div>
      {/* <h2 className="collection-title">Collection for Store: {id}</h2> */}
      <div className="product-grid">
        {collections?.length > 0 &&
          collections.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product?._id)}
            >
              <div className="image-container">
                <img
                  src={product.mediaUrls[0]}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">₹{product.price}</p>

                <div className="button-container">
                  <button className="buy-button">Buy Now</button>
                  <button className="cart-button">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default CollectionPage
