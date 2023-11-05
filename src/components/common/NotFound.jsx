import { useNavigate } from 'react-router-dom';

import { Box, Button, Container, Typography, Link, useTheme } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { FormattedMessage } from 'react-intl';

import notFound from 'assets/image/404.jpg';

import { GUEST_PATHS } from 'utils';

const Page = () => {
    const navigate = useNavigate();

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    return (
        <>
            <Box
                backgroundColor={alt}
                component="main"
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexGrow: 1,
                    minHeight: '100%',
                    height: '100vh'
                }}
            >
                <Container maxWidth="md">
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Box
                            sx={{
                                mb: 3,
                                textAlign: 'center'
                            }}
                        >
                            <img
                                alt="Under development"
                                src={notFound}
                                style={{
                                    display: 'inline-block',
                                    maxWidth: '100%',
                                    width: 400
                                }}
                            />
                        </Box>
                        <Typography align="center" sx={{ mb: 3 }} variant="h3">
                            <FormattedMessage id="guest.notFound.title" />
                        </Typography>
                        <Typography align="center" color="text.secondary" variant="body1">
                            <FormattedMessage id="guest.notFound.subTitle" />
                        </Typography>
                        <Button startIcon={<ArrowBack />} sx={{ mt: 3 }} variant="contained" color="info">
                            <Link sx={{ color: 'white' }} onClick={() => navigate(GUEST_PATHS.GUEST)} underline="none">
                                <FormattedMessage id="guest.notFound.btn" />
                            </Link>
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default Page;
