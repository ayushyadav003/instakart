import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import './StoreLayout.scss'
import { Drawer } from '@mui/material'
import Cart from '../../components/collection/cart/Cart'

const StoreLayout = ({ children }) => {
  const [cart, setCart] = useState(false)
  return (
    <div className="store-layout">
      {/* Header */}
      <header className="store-header">
        <div className="logo">My Store</div>
        <div className="cart-icon">
          <ShoppingCartOutlinedIcon fontSize="medium" onClick={()=> setCart(true)} />
        </div>
      </header>

      {/* Main Content */}
      <main className="store-content">{children}</main>
      <Drawer anchor={"right"} open={cart} onClose={() => setCart(false)}>
        <Cart />
      </Drawer>
      {/* Footer */}
      <footer className="store-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About Us</h4>
            <p>We provide high-quality handmade and customized products.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Shop</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#">
                <FacebookIcon fontSize="small" />
              </a>
              <a href="#">
                <InstagramIcon fontSize="small" />
              </a>
              <a href="#">
                <TwitterIcon fontSize="small" />
              </a>
            </div>
          </div>
        </div>
        <p className="footer-bottom">
          &copy; 2025 My Store. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default StoreLayout
