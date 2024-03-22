import { useTimeout } from '@fuse/hooks';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useState } from 'react';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import { useAuth0 } from '@auth0/auth0-react';

function LogoutLoading() {
  const [showLoading, setShowLoading] = useState(true);
  const { logout } = useAuth0();

  useTimeout(() => {
    logout({
        logoutParams: {
            returnTo: window.location.origin
        }
    })
  }, []);

  return (
    <div
      className={clsx(
        'flex flex-1 flex-col items-center justify-center p-24',
        !showLoading && 'hidden'
      )}
    >
      <Typography className="text-13 sm:text-20 font-medium -mb-16" color="text.secondary">
        Saindo
      </Typography>
      <Box
        id="spinner"
        sx={{
          '& > div': {
            backgroundColor: 'palette.primary.main',
          },
        }}
      >
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </Box>
    </div>
  );
}

export default LogoutLoading;
