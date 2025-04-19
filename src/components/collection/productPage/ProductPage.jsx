import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import '../CollectionPage.scss'
import { useDispatch } from 'react-redux'
import { startLoading, stopLoading } from '../../../redux/features/userSlice'
import { apiConfig } from '../../../services/ApiConfig'
import { ApiWithToken } from '../../../services/ApiWithToken'
import { StarOutline } from '@mui/icons-material'
import { Button } from '@mui/material'

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
    <div className="productPage">
      <div className="productDetailsSection">
        <div className="productImage">
          <div className="imageList">
            <img
              src={
                productData?.mediaUrls?.length > 0 && productData?.mediaUrls[0]
              }
              alt={productData.name}
            />
          </div>
          <img
            className="mainImg"
            src={
              productData?.mediaUrls?.length > 0 && productData?.mediaUrls[0]
            }
            alt={productData.name}
          />
        </div>
        <div className="productDetails">
          <h1>{productData?.title}</h1>
          <p className="productDescription">{productData.description}</p>
          <div className="ratingWrapper">
            <span>4.5</span>
            <div>
            <StarOutline />
            <StarOutline />
            <StarOutline />
            <StarOutline />
            <StarOutline />
            </div>
          </div>
          <div className="variantWrapper">
            <p>Options</p>
            <div>
              <span>Default</span>
            </div>
          </div>
          <div className="productPrice">            
            <span className="comparePrice"> ₹ {productData.comparePrice}</span>
            <span className="price"> ₹ {productData.price}</span>
          </div>

          <div className="buttonContainer">
            <Button className="buyButton">Buy Now</Button>
            <Button onClick={() => addToCart()} className='cartBtn'>
              <ShoppingCartOutlinedIcon /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
