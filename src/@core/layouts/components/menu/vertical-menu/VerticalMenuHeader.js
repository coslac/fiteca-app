/* eslint-disable multiline-ternary */
// ** React Imports
import {useEffect} from "react";
import {NavLink, useLocation} from "react-router-dom";

// ** Icons Imports
import {Circle, Disc, X} from "react-feather";

// ** Config
import themeConfig from "@configs/themeConfig";

import {getHomeRouteForLoggedInUser, getUserData} from "@utils"

const VerticalMenuHeader = (props) => {
  const location = useLocation()
  // ** Props
  const {
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover,
  } = props;

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([]);
  }, [menuHover, menuCollapsed]);

  useEffect(() => {
    if (location.pathname.includes('/script-generator')) {
      setMenuCollapsed(false)
    }
  })

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour="toggle-icon"
          className="text-lighter toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(true)}
        />
      );
    } else {
      return (
        <Circle
          size={20}
          data-tour="toggle-icon"
          className="text-lighter toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      );
    }
  };

  return (
    <div className="navbar-header">
      <ul className="nav navbar-nav flex-row" style={{background: 'transparent', alignItems: 'center'}}>
        <li className="nav-item me-auto">
        <NavLink to={getHomeRouteForLoggedInUser(getUserData()?.role)} className="navbar-brand" style={{marginTop: '0px', marginBottom: '0px'}}>
          {menuCollapsed ?
            <img
              alt="brand-name"
              width={48}
              height={48}
              src={themeConfig.app.appLogoImage}
            />
             :
            <img
              width={133}
              alt="brand-name"
              src={themeConfig.app.appName}
            />
            }
          </NavLink>
        </li>
        {location.pathname.includes('/script-generator') ?
        <div></div> :
        <li className="nav-item nav-toggle" style={{alignSelf: 'center'}}>
          <div className="nav-link modern-nav-toggle cursor-pointer">
            <Toggler />
            <X
              onClick={() => setMenuVisibility(false)}
              className="toggle-icon icon-x d-block d-xl-none"
              size={20}
            />
          </div>
        </li>}
      </ul>
    </div>
  );
};

export default VerticalMenuHeader;
