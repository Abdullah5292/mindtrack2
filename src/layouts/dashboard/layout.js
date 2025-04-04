import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { withAuthGuard } from 'src/hocs/with-auth-guard';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: SIDE_NAV_WIDTH
  }
}));

const LayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%'
});

export const Layout = withAuthGuard((props) => {
  const { children } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(true);

  useEffect(
    () => {
      if (openNav) {
        setOpenNav(false);
      }
    },
    [pathname, openNav]
  );

  return (
    <>
      <Image
        src="/assets/Background.svg"
        alt="Background"
        layout="fill" // Makes it cover the full parent div
        objectFit="cover" // Ensures it scales properly
        priority // Loads the image faster
      />
      <TopNav onNavOpen={() => setOpenNav(true)} />
      <SideNav
        onClose={() => setOpenNav(false)}
        open={openNav}
      />
      <LayoutRoot>
        <LayoutContainer>
          {children}
        </LayoutContainer>
      </LayoutRoot>
    </>
  );
});
