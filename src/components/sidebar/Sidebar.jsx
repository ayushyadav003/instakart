import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { mobileBottomOptions, sideBarOption } from "../../utils/DashboardUtils";
import "./sidebar.scss";
import {
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";

function Sidebar() {
  const location = useLocation();
  const [hide, setHide] = useState(false);



  return (
    <>
      <div className="sidebar-container" style={{ width: hide && "70px" }}>
        <div className="profileWrapper" height="50">
          <Tooltip title="My profile" placement="bottom-end">
            <Link to="/profile">
              {hide ? (
                <img src="/assets/images/logo/logo_light.png" />
              ) : (
                <img src="/assets/images/logo/logo_light.png" />
              )}
            </Link>
          </Tooltip>
        </div>
        <div className="optionWrapper">
          {sideBarOption.map((option, i) => (
            <Link
              key={i}
              to={option.link}
              style={{
                background:
                  option.link === location?.pathname &&
                  "rgb(210 210 210 / 36%)",
                width: hide && "fit-content",
              }}
            >
              {option?.icon}
              {!hide && <p>{option.title}</p>}
            </Link>
          ))}
        </div>
        <div className="sidebarShrinkBtn" onClick={() => setHide(!hide)}>
          {!hide ? <KeyboardDoubleArrowLeft /> : <KeyboardDoubleArrowRight />}
        </div>
      </div>
      <div className="mobile-bottom-touchbar">
        <div className="optionWrapper">
          {mobileBottomOptions.map((option, i) => (
            <Link key={i} to={option.link}>
              <div>
                <img src={option.icon} />
                {option.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
