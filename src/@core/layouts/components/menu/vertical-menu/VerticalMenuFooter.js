// ** React Imports
import {useState} from 'react'

// ** Menu Items Array
import NavigationFooter from '@src/navigation/vertical/footer'

// Components
import VerticalNavMenuItems from './VerticalNavMenuItems'

const VerticalMenuFooter = props => {

  // ** Props
  const { menuCollapsed, routerProps, currentActiveItem, menuData } = props

  // ** States
  const [groupOpen, setGroupOpen] = useState([])
  const [groupActive, setGroupActive] = useState([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState([])
  const [activeItem, setActiveItem] = useState(null)

  // ** Menu Hover State
  const [menuHover] = useState(false)


  return (
    <div className='main-menu-content'>
      <ul className='navigation navigation-main'>
        <VerticalNavMenuItems
          items={NavigationFooter}
          menuData={NavigationFooter}
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
        />
      </ul>
    </div>
  )
}

export default VerticalMenuFooter
