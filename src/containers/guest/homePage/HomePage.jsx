import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Box, Typography, Button, Paper } from '@mui/material';

import { FormattedMessage } from 'react-intl';

import Cookies from 'js-cookie';

import BookingSection from './BookingSection';
import Promotion from './Promotion';
import CTA from './CTA';

import { saveUserInfo } from 'store/slice/authSlice';

const HomePage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const dataCookie = Cookies.get('data');
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');
        if (dataCookie && accessToken && refreshToken) {
            const data = JSON.parse(dataCookie);
            dispatch(saveUserInfo({ data, accessToken, refreshToken }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Box sx={{ flex: '1 1 auto' }}>
                <Paper
                    sx={{
                        position: 'relative',
                        height: '85vh',
                        color: '#fff',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundImage:
                            'url(https://res.cloudinary.com/dvz7jacpr/image/upload/v1696256058/NhanManor/morning_viaxdb.jpg)',
                        backgroundAttachment: 'fixed',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            right: 0,
                            left: 0,
                            backgroundColor: 'rgba(0,0,0,.3)',
                        }}
                    />

                    <Box
                        sx={{
                            width: '50%',
                            position: 'absolute',
                            left: '10%',
                            top: '50%',
                            transform: 'translate(-10%, -50%)',
                        }}
                    >
                        <Typography
                            component="h1"
                            variant="h1"
                            color="inherit"
                            mb={3}
                            sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                        >
                            <FormattedMessage id="guest.homePage.title" />
                        </Typography>
                        <Typography
                            component="h1"
                            variant="h4"
                            color="inherit"
                            mb={3}
                            sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                        >
                            <FormattedMessage id="guest.homePage.subtitle" />
                        </Typography>
                        <Button variant="contained" color="primary">
                            <FormattedMessage id="guest.homePage.discover" />
                        </Button>
                    </Box>
                </Paper>
            </Box>

            <BookingSection />
            <CTA />
            <Promotion />
        </>
    );
};
export default HomePage;
