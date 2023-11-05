import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import Header from 'components/guest/Header';
import Footer from 'components/guest/Footer';

import BackToTop from 'components/common/BackTopTop';
import SpeedDial from 'components/common/SpeedDial';

const GuestLayout = () => {
    return (
        <>
            <Box component="main">
                <Header />
                <Outlet />
                <Footer />
                <SpeedDial />
                <BackToTop />
            </Box>
        </>
    );
};

export default GuestLayout;
