// ** React Imports
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { isUserLoggedIn } from "@utils";

// ** Store & Actions
import { useDispatch } from "react-redux";
import { handleLogout } from "@store/authentication";

// ** Third Party Components
import { CreditCard, HelpCircle, Power, Settings, ChevronDown } from "react-feather";

import { useTranslation } from "react-i18next";

// ** Reactstrap Imports
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/avatars/avatar-blank.png";

import './styles.scss'

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch();

  const { t } = useTranslation();

  // ** State

  const userData = isUserLoggedIn() !== null ? JSON.parse(localStorage.getItem("userData")) : null;

  //** ComponentDidMount
  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar;

  return (
    <UncontrolledDropdown
      tag="li"
      className="dropdown-user nav-item"
    >
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="paragraph-small-semi-bold text-offwhite">
            {(userData && userData.nome) || "--"}
          </span>
          <span className="paragraph-small text-lighter ">
            {userData && userData.email}
          </span>
        </div>
        <Avatar
          className="vsl-avatar"
          img={userAvatar}
          imgHeight="30"
          imgWidth="30"
          status="online"
        />
        <ChevronDown size={16} color="#788CA0"/>
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem divider />
        <DropdownItem tag={Link} to="/pages/account-settings">
          <Settings size={14} className="me-75" />
          <span className="align-middle">{t("Account Settings")}</span>
        </DropdownItem>
        <DropdownItem
          tag={Link}
          to="/login"
          onClick={() => dispatch(handleLogout())}
        >
          <Power size={14} className="me-75" />
          <span className="align-middle">{t("Logout")}</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
