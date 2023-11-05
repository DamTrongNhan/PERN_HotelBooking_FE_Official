import { Box, Typography, Unstable_Grid2 as Grid, useTheme } from '@mui/material';
import { EditCalendarOutlined, AccountBalanceWalletOutlined, LocationOnOutlined } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { FormattedMessage } from 'react-intl';

const CTA = () => {
    const isNonMobile = useMediaQuery('(min-width:960px)');

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    const CTA = [
        {
            icon: <EditCalendarOutlined color="error" sx={{ fontSize: '100px' }} />,
            header: <FormattedMessage id="guest.homePage.signUp" />,
            body: <FormattedMessage id="guest.homePage.signUpContent" />,
        },
        {
            icon: <AccountBalanceWalletOutlined color="primary" sx={{ fontSize: '100px' }} />,
            header: <FormattedMessage id="guest.homePage.worth" />,
            body: <FormattedMessage id="guest.homePage.worthContent" />,
        },
        {
            icon: <LocationOnOutlined color="warning" size="large" sx={{ fontSize: '100px' }} />,
            header: <FormattedMessage id="guest.homePage.exciting" />,
            body: <FormattedMessage id="guest.homePage.excitingContent" />,
        },
    ];
    return (
        <>
            <Box backgroundColor={alt} p={5} sx={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
                <Grid
                    lg={12}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '20px',
                    }}
                >
                    <Typography variant="h1" sx={{ color: 'orange' }}>
                        <FormattedMessage id="guest.homePage.cta" />
                    </Typography>
                    <Typography variant="body1">
                        <FormattedMessage id="guest.homePage.ctaContent" />
                    </Typography>
                </Grid>

                <Grid container spacing={4}>
                    {CTA &&
                        CTA.map((item, index) => (
                            <Grid key={index} xs={12} sm={6} md={4}>
                                <Box
                                    key={index}
                                    backgroundColor={neutralLight}
                                    p={5}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                                        transition: '0.3s',
                                        borderRadius: '8px',
                                        '&:hover': {
                                            boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)',
                                        },
                                    }}
                                >
                                    {item.icon}
                                    <Typography mt={3}>{item.header}</Typography>
                                    <Typography mt={2}>{item.body}</Typography>
                                </Box>
                            </Grid>
                        ))}
                </Grid>
            </Box>
        </>
    );
};
export default CTA;
