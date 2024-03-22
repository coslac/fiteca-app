// ** Dropdowns Imports
import UserDropdown from './UserDropdown'
import NotificationDropdown from './NotificationDropdown'
import { useLocation, useHistory } from 'react-router-dom'

// ** Third Party Components
import { Moon, Sun } from 'react-feather'
import OutButton from '@src/@core/components/vsl-button'
import NotificationsOffCanvas from './NotificationsOffCanvas'

// ** Reactstrap Imports

const NavbarUser = props => {
  const location = useLocation()
  const history = useHistory()
  // ** Props
  const { skin, setSkin } = props

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />
    }
  }

  return (
    <>
      {
        // eslint-disable-next-line multiline-ternary
        location.pathname.includes('/script-generator') ?
          // eslint-disable-next-line multiline-ternary
          <>
          <OutButton title={'Voltar ao projeto'} color='primary' onClick={() => history.push('/home')} style={{ height: 40, marginTop: 12 }} />
          <ul className='nav navbar-nav align-items-center ms-auto'>
              {/* <NotificationDropdown /> */}
              <UserDropdown />
          </ul>
          </>
          :
          <ul className='nav navbar-nav align-items-center ms-auto'>
            {/* <IntlDropdown />
          <NavItem className='d-none d-lg-block'>
            <NavLink className='nav-link-style'>
              <ThemeToggler />
            </NavLink>
        </NavItem>
        */}
            {/* <NotificationDropdown /> */}
            <NotificationsOffCanvas/>
            <UserDropdown />
          </ul>}
    </>
  )
}
export default NavbarUser
