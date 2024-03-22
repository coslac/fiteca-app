import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  '& > .logo-icon': {
    transition: theme.transitions.create(['width', 'height'], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  '& > .badge': {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

function Logo2() {
  return (
    <Root className="flex items-center">
      <img className="logo-icon" style={{width: '11.2rem', height: 'auto'}} src="assets/images/logo/logo.png" alt="Logo2" />
    </Root>
  );
}

export default Logo2;
