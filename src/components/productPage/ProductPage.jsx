import React from 'react'
import { useParams } from 'react-router-dom'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import './ProductPage.scss'

const sampleProducts = [
  {
    id: '1',
    name: 'Handmade Greeting Card',
    description:
      'A beautifully crafted handmade greeting card for special occasions.',
    price: '₹299',
    comparePrice: '₹399',
    image: 'https://images.pexels.com/photos/2072181/pexels-photo-2072181.jpeg',
  },
  {
    id: '2',
    name: 'Vintage Notebook',
    description: 'A vintage-style notebook with premium-quality paper.',
    price: '₹499',
    comparePrice: '₹699',
    image: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg',
  },
]

function ProductPage() {
  const { productId } = useParams()

  if (!product) {
    return <h2>Product Not Found</h2>
  }

  return (
    <div className="product-page">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-details">
        <h1>{product.name}</h1>
        <p className="product-description">{product.description}</p>
        <div className="product-price">
          <span className="price">{product.price}</span>
          <span className="compare-price">{product.comparePrice}</span>
        </div>
        <div className="product-buttons">
          <button className="buy-button">Buy Now</button>
          <button className="cart-button">
            <ShoppingCartOutlinedIcon /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
