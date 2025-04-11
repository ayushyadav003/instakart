import React, { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import './CollectionPage.scss'
import { startLoading, stopLoading } from '../../redux/features/userSlice'
import { apiConfig } from '../../services/ApiConfig'
import { ApiWithToken } from '../../services/ApiWithToken'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

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

  useEffect(() => {
    if (businessName) {
      getCollections()
    }
  }, [businessName])

  return (
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
            <div
              key={product.id}
              className="productCard"
              onClick={() => handleProductClick(product?._id)}
            >
              <div className="imageContainer">
                <img
                  src={product.mediaUrls[0]}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="productDetails">
                <div className="inner">
                  <p className="product-name">{product.title}</p>
                  <h5 className="product-price">₹{product.price}</h5>
                </div>

                <p className="description">{product.description}</p>

                <div className="buttonContainer">
                  <button className="buyButton">Buy Now</button>
                  <button className="cartButton">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default CollectionPage
