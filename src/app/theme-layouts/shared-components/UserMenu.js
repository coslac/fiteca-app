import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectUser } from 'app/store/userSlice';
import { useAuth0 } from '@auth0/auth0-react';

function UserMenu(props) {
  const { user, logout } = useAuth0();
  // const user = useSelector(selectUser);

  const [userMenu, setUserMenu] = useState(null);

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  return (
    <>
      <Button
        className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
        onClick={userMenuClick}
        color="inherit"
      >
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
            {user?.name}
          </Typography>
          <Typography className="text-11 font-medium capitalize" color="text.secondary">
            {user?.email}
            {(!user?.email || (Array.isArray(user?.email) && user?.email.length === 0)) && 'Guest'}
          </Typography>
        </div>

        {user?.picture ? (
          <Avatar className="md:mx-4" alt="user photo" src={user?.picture} />
        ) : (
          <Avatar className="md:mx-4">{user?.name[0]}</Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        {!user?.email || user?.email.length === 0 ? (
          <>
            <MenuItem component={Link} to="/sign-in" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Login" />
            </MenuItem>
            <MenuItem component={Link} to="/sign-up" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-add </FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Registrar" />
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={Link} to="/apps/profile" onClick={userMenuClose} role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Minha Conta" />
            </MenuItem>
            {/* <MenuItem component={Link} to="/apps/mailbox" onClick={userMenuClose} role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:mail-open</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </MenuItem> */}
            <MenuItem
              component={NavLink}
              to="/logout"
            >
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </MenuItem>
          </>
        )}
      </Popover>
    </>
  );
}

export default UserMenu;
