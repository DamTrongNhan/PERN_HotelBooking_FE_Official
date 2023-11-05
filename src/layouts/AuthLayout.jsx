import { Link, Outlet } from 'react-router-dom';

import { Box, useTheme, Typography, Unstable_Grid2 as Grid } from '@mui/material';

import { FormattedMessage } from 'react-intl';

import { WithUserIsNotAuthenticatedGuard } from 'hoc/WithUserIsNotAuthenticatedGuard';

import AuthImage from 'assets/image/authImage.png';
import Logo from 'assets/image/logo.png';

import { GUEST_PATHS } from 'utils';

const AuthLayout = WithUserIsNotAuthenticatedGuard(() => {
    const theme = useTheme();
    const alt = theme.palette.background.alt;

    return (
        <Box
            component="main"
            backgroundColor={alt}
            sx={{
                display: 'flex',
                flex: '1 1 auto',
            }}
        >
            <Grid container sx={{ flex: '1 1 auto' }}>
                <Grid
                    xs={12}
                    lg={6}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                    }}
                >
                    <Box
                        component="header"
                        sx={{
                            left: 0,
                            top: 0,
                            position: 'absolute',
                            p: 3,
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'inline-flex',
                                height: 70,
                                width: 70,
                            }}
                        >
                            <Link to={GUEST_PATHS.GUEST}>
                                <img src={Logo} alt="" width="100%" />
                            </Link>
                        </Box>
                    </Box>
                    <Outlet />
                </Grid>
                <Grid
                    xs={12}
                    lg={6}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '& img': {
                            width: '82%',
                        },
                    }}
                >
                    <Box sx={{ p: 3 }}>
                        <Typography
                            align="center"
                            color="inherit"
                            sx={{
                                fontSize: '24px',
                                lineHeight: '32px',
                                mb: 1,
                            }}
                            variant="h1"
                        >
                            Welcome to &nbsp;
                            <Box sx={{ color: '#007bff', display: 'inline' }}>Nhan Manor</Box>
                        </Typography>
                        <Typography align="center" sx={{ mb: 3 }} variant="subtitle1">
                            <FormattedMessage id="auth.slogan" />
                        </Typography>
                        <img src={AuthImage} alt="Auth" />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
});
export default AuthLayout;
