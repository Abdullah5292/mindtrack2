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

    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#8d1f47',
        overflowY: 'hidden' // Fallback background color
      }}
    >
      {/* <Image
        src="/assets/Background.svg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        height: "100%"
      width: "100%"
      priority
      /> */}


      <Image
        src="/assets/Background.svg"
        alt="Your image"
        fill
        style={{ objectFit: 'cover', width: '100%', height: '100%' }} // or 'contain'
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
    </div>
  );
});
