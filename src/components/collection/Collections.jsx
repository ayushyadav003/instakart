import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

  const handleProductClick = (productId) => {
    navigate(`/${id}/${productId}`) // Navigate to Product Page
  }

    const getCollections = async () => {
      try {
        dispatch(startLoading())
        const apiOptions = {
          url: apiConfig.product,
          method: 'GET',

        }
        const response = await ApiWithToken(apiOptions)
        if (response?.status === 200) {
          setCollections(response?.data?.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        dispatch(stopLoading())
      }
    }

    useEffect(()=>{
      getCollections()
    },[])
  

  return (
    <div className="collection-page">
      <h2 className="collection-title">Collection for Store: {id}</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => handleProductClick(product.id)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>

            <div className="button-container">
              <button className="buy-button">Buy Now</button>
              <button className="cart-button">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CollectionPage
