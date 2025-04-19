import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import './StoreLayout.scss'
import { Badge, Drawer } from '@mui/material'
import Cart from '../../components/collection/cart/Cart'

const StoreLayout = ({ children }) => {
  const [cart, setCart] = useState(false)
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem('cartProducts')) || [],
  )

  return (
    <div className="store-layout">
      {/* Header */}
      <header className="store-header">
        <div className="logo">My Store</div>
        <div className="cart-icon">
          <Badge badgeContent={cartItems?.length || 0} color="secondary">
            <ShoppingCartOutlinedIcon
              fontSize="medium"
              onClick={() => setCart(true)}
            />
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="store-content">{children}</main>
      <Drawer anchor={'right'} open={cart} onClose={() => setCart(false)}>
        <Cart
          cartItems={cartItems}
          setCartItems={setCartItems}
          setCart={setCart}
        />
      </Drawer>
      {/* Footer */}
      <footer className="storeFooter">
        <div className="footerContent">
          <div className="footerSection">
            <img src="/assets/images/logo/logo_light.png" />
          </div>
          <div className="footerSection">
            <h4>Categories</h4>
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
          <div className="footerSection">
            <h4>Contact Us</h4>
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
          <div className="footerSection">
            <h4>Support</h4>
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
          <div className="footerSection">
              <h4>Follow Us</h4>
              <div className="socialIcons">
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
        <div className="footerBottom">
          <p>&copy; 2025 My Store. All rights reserved.</p>
          <p>
            <span>Terms and Conditions</span>
            <span>Privacy Policy</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default StoreLayout
