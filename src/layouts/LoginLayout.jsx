import './layout.scss'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  EmailOutlined,
  FacebookOutlined,
  Instagram,
  LinkedIn,
  Menu,
  PhoneOutlined,
  X,
  YouTube,
} from '@mui/icons-material'
import Footer from '../components/footer/Footer'
import { Drawer } from '@mui/material'

// eslint-disable-next-line react/prop-types
export default function LoginLayout({ children }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [openDrawer, setOpenDrawer] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/dashboard/overview')
    }

    if (searchParams?.get('refKey')) {
      localStorage.setItem('refKey', searchParams?.get('refKey'))
    }
  }, [])

  return (
    <div className="loginLayout">
      <div className="header">
        <div className="inner">
          <div>
            <PhoneOutlined className="icon" />
            <span>Phone: (+91) 941-006-9556</span>
          </div>
          <div>
            <EmailOutlined className="icon" />
            <span>info@blitzshipz.com</span>
          </div>
        </div>
        <div className="socialIcons">
          <X />
          <FacebookOutlined />
          <Instagram />
          <YouTube />
          <LinkedIn />
        </div>
      </div>
      <div className="loginContainer">
        {children}
        <div className="loginInner">
          <img src={'/assets/images/auth-layout.jpg'} alt="" />
          {/* <img
            src={
              'https://res.cloudinary.com/dgoa103uk/image/upload/v1730197039/app-home-banner_fph264.png'
            }
            alt=""
          /> */}
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}
