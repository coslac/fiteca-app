// ** React Imports
import {useEffect, useState} from 'react'
import {NavLink, useLocation, useHistory} from 'react-router-dom'
import {store} from "@store/store"

// ** Third Party Components
import classnames from 'classnames'
import {useTranslation} from 'react-i18next'

// ** Reactstrap Imports
import {Badge} from 'reactstrap'

import NewProject from "@src/views/pages/vsl-client/projects/newProject";
import { useSelector } from "react-redux";

const VerticalNavMenuLink = ({ item, activeItem, setActiveItem, currentActiveItem, key }) => {

  const history = useHistory()
  const modal = useSelector((state) => state.modalProject);
  const [show, setShow] = useState(false);

  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink
  const [myProj, setMyProj] = useState({})
  // ** Hooks
  const { t } = useTranslation()
  const location = useLocation()

  useEffect(() => {
    if (currentActiveItem !== null) {
      setActiveItem(currentActiveItem)
    }
  }, [location])

  return (
    <li
      key={key}
      className={classnames({
        'nav-item': !item.children,
        disabled: item.disabled,
        active: item.navLink === activeItem
      })}
    >
      <NewProject
            show={show}
            setShow={setShow}
          />
      <LinkTag
        className='d-flex align-items-center'
        target={item.newTab ? '_blank' : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? {
              href: item.navLink || '/'
            }
          : {
              to: item.navLink || '/',
              isActive: match => {
                if (!match) {
                  return false
                }

                if (match.url && match.url !== '' && match.url === item.navLink) {
                  currentActiveItem = item.navLink
                }
              }
            })}
        onClick={e => {
          if (item.navLink.length === 0 || item.navLink === '#' || item.disabled === true) {
            e.preventDefault()
            item.onClick()
            setShow(!show)
          }
          if (item.navLink === "/login") {
            e.preventDefault()
            item.onClick()
            history.push('/login')
          }
        }}
      >
        {item.icon}
        <span className='menu-item text-truncate'>{t(item.title)}</span>

        {item.badge && item.badgeText ? (
          <Badge className='ms-auto me-1' color={item.badge} pill>
            {item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  )
}

export default VerticalNavMenuLink
