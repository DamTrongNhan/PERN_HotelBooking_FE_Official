import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { styled } from '@mui/material';

import { WithAdminIsAuthenticatedGuard } from 'hoc/WithAdminIsAuthenticatedGuard';

import SideNav from 'components/dashboard/SideNav';
import TopNav from 'components/dashboard/TopNav';

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    [theme.breakpoints.up('lg')]: {
        paddingLeft: SIDE_NAV_WIDTH,
    },
}));

const LayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
});

const Layout = WithAdminIsAuthenticatedGuard(() => {
    const [openNav, setOpenNav] = useState(false);

    return (
        <>
            <TopNav onNavOpen={() => setOpenNav(true)} />
            <SideNav onClose={() => setOpenNav(false)} open={openNav} />
            <LayoutRoot>
                <LayoutContainer>
                    <Outlet />
                </LayoutContainer>
            </LayoutRoot>
        </>
    );
});
export default Layout;
