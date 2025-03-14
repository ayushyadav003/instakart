/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AccountBalanceWallet,
  ArrowBackIos,
  Logout,
  Notifications,
} from '@mui/icons-material'
import './layout.scss'
import { Badge, Popover } from '@mui/material'
import { useSelector } from 'react-redux'
import Sidebar from '../components/sidebar/Sidebar'

function DashboardLayout({ children }) {
  const navigate = useNavigate()
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false)
  const [showBack, setShowBack] = useState(false)
  const [walletAmount, setWalletAmount] = useState(0)
  const userData = JSON.parse(localStorage.getItem('instakart-user-details'))
  const firstName = userData?.firstName || ''
  const lastName = userData?.firstName || ''
  const email = userData?.firstName || ''
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

  return (
    <div className="dashboardContainer">
      <div className="sidebarWrapper">
        <Sidebar />
      </div>
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
