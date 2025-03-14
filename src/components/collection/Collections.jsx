import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './CollectionPage.scss'

const products = [
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
  {
    id: '3',
    name: 'Customized Mug',
    description: 'A stylish ceramic mug with customizable text or images.',
    price: '₹399',
    comparePrice: '₹499',
    image: 'https://images.pexels.com/photos/3046644/pexels-photo-3046644.jpeg',
  },
  {
    id: '4',
    name: 'Wooden Photo Frame',
    description:
      'A handcrafted wooden photo frame to keep your memories alive.',
    price: '₹599',
    comparePrice: '₹799',
    image: 'https://images.pexels.com/photos/1757971/pexels-photo-1757971.jpeg',
  },
  {
    id: '5',
    name: 'Personalized Keychain',
    description: 'A keychain with customizable engravings of your choice.',
    price: '₹199',
    comparePrice: '₹299',
    image:
      'https://images.pexels.com/photos/10502602/pexels-photo-10502602.jpeg',
  },
  {
    id: '6',
    name: 'Handmade Scrapbook',
    description: 'A beautiful handmade scrapbook to preserve your memories.',
    price: '₹799',
    comparePrice: '₹999',
    image: 'https://images.pexels.com/photos/1695735/pexels-photo-1695735.jpeg',
  },
  {
    id: '7',
    name: 'Engraved Wooden Pen',
    description: 'A premium wooden pen with personalized engraving options.',
    price: '₹349',
    comparePrice: '₹499',
    image: 'https://images.pexels.com/photos/1508597/pexels-photo-1508597.jpeg',
  },
  {
    id: '8',
    name: 'Scented Candle Set',
    description: 'A set of aromatic candles perfect for relaxation.',
    price: '₹649',
    comparePrice: '₹849',
    image: 'https://images.pexels.com/photos/2759802/pexels-photo-2759802.jpeg',
  },
  {
    id: '9',
    name: 'Leather Journal',
    description: 'A handcrafted leather journal for your notes and sketches.',
    price: '₹899',
    comparePrice: '₹1199',
    image: 'https://images.pexels.com/photos/3278754/pexels-photo-3278754.jpeg',
  },
  {
    id: '10',
    name: 'Minimalist Wall Clock',
    description:
      'A sleek and modern minimalist wall clock for your home decor.',
    price: '₹1299',
    comparePrice: '₹1599',
    image: 'https://images.pexels.com/photos/1529921/pexels-photo-1529921.jpeg',
  },
]

const CollectionPage = () => {
  const { id } = useParams() // Get store ID from URL
  const navigate = useNavigate()

  const handleProductClick = (productId) => {
    navigate(`/${id}/${productId}`) // Navigate to Product Page
  }

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
