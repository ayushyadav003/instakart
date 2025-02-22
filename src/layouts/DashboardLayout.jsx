/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AccountBalanceWallet,
  AccountCircle,
  ArrowBackIos,
  ArrowForward,
  KeyboardBackspace,
  Logout,
  Notifications,
} from '@mui/icons-material'
import './layout.scss'
import { Badge, Popover } from '@mui/material'
import { useSelector } from 'react-redux'
import { apiConfig } from '../services/ApiConfig'
import { ApiWithToken } from '../services/ApiWithToken'

function DashboardLayout({ children }) {
  const navigate = useNavigate()
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false)
  const [showBack, setShowBack] = useState(false)
  const [walletAmount, setWalletAmount] = useState(0)
  const [hideNeedHelp, setHideNeedHelp] = useState(true)
  const location = useLocation()

  const firstName = localStorage.getItem('firstName')
  const lastName = localStorage.getItem('lastName')
  const email = localStorage.getItem('email')
  // const userID = localStorage.getItem("accountUserId");

  const { heading } = useSelector(({ current }) => current)

  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorElNotification, setAnchorElNotification] = useState(null)
  const [notificationList, setNotificationList] = useState([
    'Welcome to Blitzshipz',
  ])
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const openNotification = Boolean(anchorElNotification)
  const popoverId = open ? 'simple-popover' : undefined
  const popoverIdNotification = openNotification ? 'simple-popover' : undefined

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const handleGetBalance = async () => {
    try {
      const apiOptions = {
        url: apiConfig?.getBalance,
        method: 'GET',
        params: {
          userId: localStorage.getItem('userId'),
        },
      }
      const response = await ApiWithToken(apiOptions)
      console.log('res', response)
      if (response?.status === 200) {
        setWalletAmount(response?.data)
        localStorage.setItem('currentBalance', response?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    switch (heading) {
      case 'Detailed Tracking':
        setShowBack(true)
        break
      case 'My Profile':
        setShowBack(true)
        break
      case 'Support':
        if (location.pathname.split('/')[2]) {
          setShowBack(true)
        }
        break
      case 'Remittance':
        setShowBack(true)
        break
      default:
        setShowBack(false)
        break
    }
  }, [location, heading])

  const handleNotification = () => {
    if (!localStorage.getItem('verified')) {
      setNotificationList([
        ...notificationList,
        'Please upload your documents.',
      ])
    }
  }

  useEffect(() => {
    handleNotification()
    handleGetBalance()
  }, [])

  return (
    <div className="dashboardContainer">
      <div
        className="helpOpener"
        style={{ display: !hideNeedHelp && 'none' }}
        onClick={() => setHideNeedHelp(false)}
      >
        <ArrowForward />
      </div>
      <div className="dummyWrapper" style={{ display: hideNeedHelp && 'none' }}>
        <KeyboardBackspace
          className="arrowIcon"
          onClick={() => setHideNeedHelp(true)}
        />
        <img src="/images/dummy2.png" />
        <img
          src="/images/box.webp"
          className="box"
          onClick={() => navigate('/faq')}
        />
        <p onClick={() => navigate('/faq')}>Need help?</p>
      </div>
      <div className="mobileHeader">
        <div>
          <img src="/images/logo/logo2.svg" />
        </div>
        <div onClick={() => navigate('/profile')}>
          <AccountCircle />
        </div>
      </div>
      <div className="sidebarWrapper">{/* <Sidebar /> */}</div>
      <div className="dashboard">
        <div className="topHeader">
          <div className="heading">
            {showBack && (
              <ArrowBackIos
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(-1)}
              />
            )}
            <p>{heading || ''}</p>
          </div>
          <div>
            <div className="walletBadge" onClick={() => navigate('/wallet')}>
              <AccountBalanceWallet />
              <p>
                {localStorage.getItem('currentBalance')
                  ? `Rs. ${walletAmount}`
                  : '...'}
              </p>
            </div>

            <Badge badgeContent={1} color="secondary">
              <Notifications
                id={popoverIdNotification}
                sx={{ fontSize: '32px', cursor: 'pointer', color: '#041c2f' }}
                onClick={(e) => setAnchorElNotification(e.currentTarget)}
              />
            </Badge>

            <Popover
              id={popoverIdNotification}
              open={openNotification}
              anchorEl={anchorElNotification}
              onClose={() => setAnchorElNotification(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <div className="notificationPopoverWrapper">
                <div className="head">Notification</div>

                <div className="inner">
                  {notificationList.map((notification, i) => (
                    <span key={i}>{notification}</span>
                  ))}
                </div>
              </div>
            </Popover>
            <span id={popoverId} className="profileDp" onClick={handleOpen}>
              {firstName && firstName[0]}
            </span>
          </div>
          <Popover
            id={popoverId}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <div className="popoverWrapper">
              <div className="inner">
                <span
                  id={popoverId}
                  className="profileDp"
                  onClick={handleOpen}
                  style={{ borderRadius: '5px', margin: '0' }}
                >
                  {firstName && firstName[0]}
                </span>
                <div className="info">
                  <p>
                    <b>{firstName + ' ' + lastName}</b>
                  </p>
                  <p>{email}</p>
                </div>
              </div>
              <div className="inner2">
                <p onClick={() => navigate('/profile')}>My Profile</p>
                <p
                  style={{ color: '#f89fa4' }}
                  onClick={() => setOpenLogoutPopup(true)}
                >
                  <Logout /> Log out
                </p>
              </div>
            </div>
          </Popover>
        </div>
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  )
}

export default DashboardLayout
