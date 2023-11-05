import { Box, Typography, Unstable_Grid2 as Grid, useTheme, Button, TextField, Link } from '@mui/material';
import { YouTube, Facebook, Instagram, LinkedIn } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';

const Footer = () => {
    const theme = useTheme();
    const alt = theme.palette.background.alt;

    const icons = [
        { icon: <YouTube fontSize="large" sx={{ color: 'black' }} /> },
        { icon: <Facebook fontSize="large" sx={{ color: 'black' }} /> },
        { icon: <Instagram fontSize="large" sx={{ color: 'black' }} /> },
        { icon: <LinkedIn fontSize="large" sx={{ color: 'black' }} /> },
    ];

    const company = [
        {
            link: (
                <Typography variant="body1">
                    <FormattedMessage id="guest.footer.about" />
                </Typography>
            ),
        },
        {
            link: (
                <Typography variant="body1">
                    <FormattedMessage id="guest.footer.awards" />
                </Typography>
            ),
        },
        {
            link: (
                <Typography variant="body1">
                    <FormattedMessage id="guest.footer.gallery" />
                </Typography>
            ),
        },
        {
            link: (
                <Typography variant="body1">
                    <FormattedMessage id="guest.footer.privacy" />
                </Typography>
            ),
        },
    ];
    const contact = [
        {
            link: (
                <Typography variant="body1">
                    <FormattedMessage id="guest.footer.help" />
                </Typography>
            ),
        },
        {
            link: (
                <Typography variant="body1">
                    <FormattedMessage id="guest.footer.customer" />
                </Typography>
            ),
        },
        {
            link: (
                <Typography variant="body1">
                    <FormattedMessage id="guest.footer.hotline" />
                </Typography>
            ),
        },
        {
            link: (
                <Typography variant="body1">
                    <FormattedMessage id="guest.footer.career" />
                </Typography>
            ),
        },
    ];
    return (
        <>
            <Box backgroundColor={alt}>
                <Grid container xs={12} lg={12} p={6} spacing={4} sx={{ justifyContent: 'center' }}>
                    <Grid mb={2} xs={12} lg={4}>
                        <Typography mb={2} variant="h2">
                            Nhan Manor
                        </Typography>
                        <Typography mb={2} variant="body1">
                            <FormattedMessage id="guest.footer.introduce" />
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px' }}>
                            {icons.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        width: '50px',
                                        height: '50px',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '50%',
                                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                        },
                                    }}
                                >
                                    {item.icon}
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                    <Grid mb={2} xs={12} lg={2}>
                        <Typography mb={2} variant="h2">
                            <FormattedMessage id="guest.footer.company" />
                        </Typography>
                        {company.map((item, index) => (
                            <Box mb={1} key={index}>
                                {item.link}
                            </Box>
                        ))}
                    </Grid>
                    <Grid mb={2} xs={12} lg={2}>
                        <Typography mb={2} variant="h2">
                            <FormattedMessage id="guest.footer.contact" />
                        </Typography>
                        {contact.map((item, index) => (
                            <Box mb={1} key={index}>
                                {item.link}
                            </Box>
                        ))}
                    </Grid>
                    <Grid
                        xs={12}
                        lg={4}
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography mb={2} variant="h2">
                            <FormattedMessage id="guest.footer.subscribe" />
                        </Typography>
                        <Typography mb={2} variant="body2">
                            <FormattedMessage id="guest.footer.subscribeContent" />
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <TextField label="Email" variant="standard" />
                            <Button variant="outlined" color="info">
                                <FormattedMessage id="guest.footer.subscribeBtn" />
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Grid p={3}>
                    <Typography align="center">
                        &copy;Copyright, Nhan Manor 2023. All rights reserved.&nbsp;
                        <Link href="#" underline="hover">
                            <FormattedMessage id="guest.footer.terms" />
                        </Link>
                    </Typography>
                </Grid>
            </Box>
        </>
    );
};

export default Footer;
