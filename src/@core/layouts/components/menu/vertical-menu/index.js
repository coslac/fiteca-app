// ** React Imports
import { Fragment, useRef, useState, useMemo, useEffect } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Vertical Menu Components
import VerticalMenuHeader from './VerticalMenuHeader'
import VerticalNavMenuItems from './VerticalNavMenuItems'
import VerticalMenuFooter from './VerticalMenuFooter'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import GenerateScriptMenu from '../../../../../views/pages/vsl-client/scriptGenerator/components/MenuGeneratescript.js'
import { getUserData } from '@utils';
import { getProjects } from '../../../../../views/pages/vsl-client/home/store'

const Sidebar = props => {
  const location = useLocation()
  const data = useSelector((state) => state.copy)
  // ** Props
  const { menuCollapsed, routerProps, menu, currentActiveItem, skin, menuData } = props
  const onClickFun = () => {
  }

  const copy = data?.data

  // ** States
  const [groupOpen, setGroupOpen] = useState([])
  const [groupActive, setGroupActive] = useState([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState([])
  const [activeItem, setActiveItem] = useState(null)
  const [lengthProjets, setLengthProjetos] = useState()
  const [loading, setLoading] = useState(Boolean)

  const isAdminUser = getUserData()?.role === "admin";

  const menuToRender = useMemo(() => {
    if (!isAdminUser) {
      console.log('opa', lengthProjets);
        if (lengthProjets > 0) {
          return menuData.filter(menu => !menu.adminAccess)
        } else {
          return menuData.filter(menu => !menu.adminAccess && menu.id !== 'my-project')
        }
    }
    return menuData;
  }, [isAdminUser, lengthProjets])

  // ** Menu Hover State
  const [menuHover, setMenuHover] = useState(false)

  // ** Ref
  const shadowRef = useRef(null)

  // ** Function to handle Mouse Enter
  const onMouseEnter = () => {
    setMenuHover(true)
  }

  // ** Scroll Menu
  const scrollMenu = container => {
    if (shadowRef && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains('d-block')) {
        shadowRef.current.classList.add('d-block')
      }
    } else {
      if (shadowRef.current.classList.contains('d-block')) {
        shadowRef.current.classList.remove('d-block')
      }
    }
  }

  useEffect(async() => {
    try {
      setLoading(true)
      const res = await getProjects({
        table: '/gbl_projeto'
      })
      setLengthProjetos(res.projects.length)
      console.log('asas', res.projects.length);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  }, [isAdminUser, lengthProjets])

  return (
    <Fragment>
      <div
        className={classnames('main-menu menu-fixed menu-accordion menu-shadow', {
          expanded: menuHover || menuCollapsed === false,
          'menu-light': skin !== 'semi-dark' && skin !== 'dark',
          'menu-dark': skin === 'semi-dark' || skin === 'dark'
        })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => setMenuHover(false)}
      >
        <div className='main-menu-circle-top'></div>
        <div className='main-menu-circle-bottom'></div>
        {menu ? (
          menu({ ...props })
        ) : (
          <Fragment>
            {/* Vertical Menu Header */}
            <VerticalMenuHeader setGroupOpen={setGroupOpen} menuHover={menuHover} {...props} />
            {/* Vertical Menu Header Shadow */}
            <div className='shadow-bottom' ref={shadowRef}></div>
            {/* Perfect Scrollbar */}
            <PerfectScrollbar
              className='main-menu-content'
              options={{ wheelPropagation: false }}
              onScrollY={container => scrollMenu(container)}
            >
              <ul className='navigation navigation-main'>
                {
                  // eslint-disable-next-line multiline-ternary
                  location.pathname.includes('/script-generator') ?
                    // eslint-disable-next-line multiline-ternary
                    <GenerateScriptMenu scriptId={copy?.[0]?.scpt_id} onSelectStage={onClickFun} /> :
                    !loading && <VerticalNavMenuItems
                      items={menuToRender}
                      menuData={menuToRender}
                      menuHover={menuHover}
                      groupOpen={groupOpen}
                      activeItem={activeItem}
                      groupActive={groupActive}
                      currentActiveGroup={currentActiveGroup}
                      routerProps={routerProps}
                      setGroupOpen={setGroupOpen}
                      menuCollapsed={menuCollapsed}
                      setActiveItem={setActiveItem}
                      setGroupActive={setGroupActive}
                      setCurrentActiveGroup={setCurrentActiveGroup}
                      currentActiveItem={currentActiveItem}
                    />}
              </ul>
            </PerfectScrollbar>
            <VerticalMenuFooter />
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}

export default Sidebar
