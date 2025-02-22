import { Link } from 'react-router-dom'
import './footer.scss'
import {
  FacebookOutlined,
  Instagram,
  LinkedIn,
  X,
  YouTube,
} from '@mui/icons-material'

const Footer = () => {
  return (
    <div className="footerWrapper">
      <div className="footerInner">
        <div className="column">
          <img src="/images/logo/logo2.svg" />
          <p>
            We fuse our global network with our depth of expertise in air
            freight, ocean freight, railway transportation, trucking, and
            multimode transportation, also we are providing sourcing,
            warehousing, E-commercial fulfillment, and value-added service to
            our customers including kitting, assembly, customized package and
            business inserts, etc.
          </p>
          <div>
            <h3>Follow Us</h3>
            <div className="socialIcons">
              <X />
              <FacebookOutlined />
              <Instagram />
              <YouTube />
              <LinkedIn />
            </div>
          </div>
        </div>
        <div className="column">
          <h2>Company</h2>
          <Link to="/">Home</Link>
          <Link to="/">About Us</Link>
          <Link to="/">Contact Us</Link>
        </div>
        <div className="row2"></div>
      </div>
      <div className="inner2">
        <p>©Blitzshipz Official 2024. All right reversed.</p>
        <div>
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Cookies</Link>
          <Link to="/">Terms of service</Link>
        </div>
      </div>
    </div>
  )
}

export default Footer
