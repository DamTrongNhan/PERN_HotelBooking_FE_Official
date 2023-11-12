import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import {
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
    Button,
    Popper,
    Fade,
    Stack,
    Paper,
    Tooltip,
    Drawer,
} from '@mui/material';

import {
    AccountCircleOutlined,
    CloseOutlined,
    WidgetsOutlined,
    LightModeOutlined,
    DarkModeOutlined,
    SearchOutlined,
    Language,
} from '@mui/icons-material';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import Logo from 'assets/image/logo.png';
import FlexBetween from 'components/common/FlexBetween';
import LoadingOverlay from 'components/common/LoadingOverlay';

import { changeLanguage, changeMode } from 'store/slice/appSlice';
import { removeUserInfo } from 'store/slice/authSlice';
import { removeChatState } from 'store/slice/chatSlice';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { signOutService } from 'services/authServices';

import { GUEST_PATHS, AUTH_PATHS, DASHBOARD_ADMIN_PATHS, DASHBOARD_USER_PATHS, LANGUAGES } from 'utils';
const Navbar = () => {
    const axiosPrivate = useAxiosPrivate();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { language } = useSelector(state => state.app);
    const { userInfo, isLoggedIn } = useSelector(state => state.auth);

    const [shouldRender, setShouldRender] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const name = userInfo?.firstName || '';

    const [anchorElLanguageDesk, setAnchorElLanguageDesk] = useState(null);
    const [openLanguageDesk, setOpenLanguageDesk] = useState(false);

    const [anchorElAccountDesk, setAnchorElAccountDesk] = useState(null);
    const [openAccountDesk, setOpenAccountDesk] = useState(false);

    const handleOpenLanguageDesk = event => {
        setAnchorElLanguageDesk(event.currentTarget);
        setOpenLanguageDesk(previousOpen => !previousOpen);
    };

    const handleOpenAccountDesk = event => {
        setAnchorElAccountDesk(event.currentTarget);
        setOpenAccountDesk(previousOpen => !previousOpen);
    };

    useEffect(() => {
        setShouldRender(true);
    }, [isLoggedIn]);

    useEffect(() => {
        if (shouldRender) {
            setShouldRender(false);
        }
    }, [shouldRender]);

    const handleChangeLanguage = inputLanguage => {
        dispatch(changeLanguage(inputLanguage));
    };
    const handleSignOut = async () => {
        try {
            setIsLoading(true);
            const response = await signOutService(axiosPrivate);
            if (response) {
                dispatch(removeUserInfo());
                dispatch(removeChatState());
                setIsLoading(false);
                toast.success(response.data.message);
                navigate(GUEST_PATHS.GUEST);
            }
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else if (error.response && error.response.data) {
                toast.error(error.response.data);
            }
        }
    };
    const handleNavigateDashboard = () => {
        if (userInfo?.roleKey === 'R1') navigate(DASHBOARD_ADMIN_PATHS.DASHBOARD);
        else if (userInfo?.roleKey === 'R2') navigate(DASHBOARD_USER_PATHS.BOOKINGS);
        else {
            toast.error('Not authenticated, redirecting');
        }
    };
    return (
        <>
            <LoadingOverlay isLoading={isLoading} />
            <FlexBetween padding="1rem 6%" backgroundColor={alt}>
                <FlexBetween sx={{ gap: '15px' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                        }}
                    >
                        <Link to={GUEST_PATHS.GUEST}>
                            <img src={Logo} alt="" width="80px" />
                        </Link>
                        <Typography
                            fontWeight="bold"
                            fontSize="clamp(1rem, 1.5rem, 2.25rem)"
                            color="primary"
                            onClick={() => navigate(GUEST_PATHS.GUEST)}
                            sx={{
                                transition: 'all linear 0.2s',
                                '&:hover': {
                                    color: primaryLight,
                                    cursor: 'pointer',
                                },
                            }}
                        >
                            Nhan Manor
                        </Typography>
                    </Box>
                    {isNonMobileScreens && (
                        <FlexBetween
                            backgroundColor={neutralLight}
                            borderRadius="9px"
                            gap="0.8rem"
                            padding="0.1rem 1.3rem"
                        >
                            <InputBase placeholder="Search..." />
                            <IconButton>
                                <SearchOutlined />
                            </IconButton>
                        </FlexBetween>
                    )}
                </FlexBetween>
                {/* DESKTOP NAV */}
                {isNonMobileScreens ? (
                    <FlexBetween gap="1rem">
                        <Button variant="contained" color="info">
                            <FormattedMessage id="guest.header.navRoom" />
                        </Button>
                        <Button onClick={() => navigate(GUEST_PATHS.GALLERY)} variant="contained" color="info">
                            <FormattedMessage id="guest.header.navGallery" />
                        </Button>
                        <Button onClick={() => navigate(GUEST_PATHS.POSTS)} variant="contained" color="info">
                            <FormattedMessage id="guest.header.navPosts" />
                        </Button>
                        <Button onClick={() => navigate(GUEST_PATHS.ABOUT)} variant="contained" color="info">
                            <FormattedMessage id="guest.header.navAboutUs" />
                        </Button>
                        <Tooltip title="Light/Dark">
                            <IconButton onClick={() => dispatch(changeMode())}>
                                {theme.palette.mode === 'dark' ? (
                                    <DarkModeOutlined sx={{ fontSize: '25px' }} />
                                ) : (
                                    <LightModeOutlined sx={{ color: dark, fontSize: '25px' }} />
                                )}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Language">
                            <IconButton onClick={handleOpenLanguageDesk}>
                                <Language sx={{ color: theme.palette.mode !== 'dark' ? dark : '', fontSize: '25px' }} />
                            </IconButton>
                        </Tooltip>
                        <Popper open={openLanguageDesk} anchorEl={anchorElLanguageDesk} transition>
                            {({ TransitionProps }) => (
                                <Fade {...TransitionProps} timeout={350}>
                                    <Paper elevation={6} sx={{ mt: 2, p: 2 }}>
                                        <Stack spacing={2}>
                                            <Button
                                                onClick={() => handleChangeLanguage(LANGUAGES.VI)}
                                                variant={LANGUAGES.VI === language ? 'contained' : ''}
                                                color="secondary"
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Vietnamese
                                            </Button>
                                            <Button
                                                onClick={() => handleChangeLanguage(LANGUAGES.EN)}
                                                variant={LANGUAGES.EN === language ? 'contained' : ''}
                                                color="secondary"
                                                sx={{ textTransform: 'none' }}
                                            >
                                                English
                                            </Button>
                                        </Stack>
                                    </Paper>
                                </Fade>
                            )}
                        </Popper>

                        {isLoggedIn ? (
                            <>
                                <Button
                                    sx={{ textTransform: 'none' }}
                                    variant="contained"
                                    onClick={handleOpenAccountDesk}
                                >
                                    {name}
                                </Button>
                                <Popper open={openAccountDesk} anchorEl={anchorElAccountDesk} transition>
                                    {({ TransitionProps }) => (
                                        <Fade {...TransitionProps} timeout={350}>
                                            <Paper elevation={6} sx={{ mt: 2, p: 2 }}>
                                                <Stack spacing={2}>
                                                    <Button
                                                        onClick={() => handleNavigateDashboard()}
                                                        variant="contained"
                                                        color="secondary"
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        <FormattedMessage id="guest.header.dashboard" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleSignOut()}
                                                        variant="contained"
                                                        color="secondary"
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        <FormattedMessage id="guest.header.signOut" />
                                                    </Button>
                                                </Stack>
                                            </Paper>
                                        </Fade>
                                    )}
                                </Popper>
                            </>
                        ) : (
                            <IconButton
                                aria-label="account"
                                onClick={() => navigate(AUTH_PATHS.SIGN_IN)}
                                sx={{ color: theme.palette.mode !== 'dark' ? dark : '', fontSize: '25px' }}
                            >
                                <AccountCircleOutlined />
                            </IconButton>
                        )}
                    </FlexBetween>
                ) : (
                    <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                        <WidgetsOutlined />
                    </IconButton>
                )}
                {/* MOBILE MENU */}

                <Drawer
                    anchor="right"
                    open={isMobileMenuToggled}
                    onClose={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    PaperProps={{
                        sx: {
                            width: 280,
                        },
                    }}
                    sx={{ zIndex: 999 }}
                >
                    <Box display="flex" justifyContent="flex-end" p="1rem">
                        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                            <CloseOutlined />
                        </IconButton>
                    </Box>

                    <Stack px={2} spacing={2}>
                        <Button variant="contained" color="info">
                            <FormattedMessage id="guest.header.navRoom" />
                        </Button>
                        <Button onClick={() => navigate(GUEST_PATHS.GALLERY)} variant="contained" color="info">
                            <FormattedMessage id="guest.header.navGallery" />
                        </Button>
                        <Button onClick={() => navigate(GUEST_PATHS.POSTS)} variant="contained" color="info">
                            <FormattedMessage id="guest.header.navPosts" />
                        </Button>
                        <Button onClick={() => navigate(GUEST_PATHS.ABOUT)} variant="contained" color="info">
                            <FormattedMessage id="guest.header.navAboutUs" />
                        </Button>

                        <Box display="flex" justifyContent="center">
                            <IconButton onClick={() => dispatch(changeMode())} sx={{ fontSize: '25px' }}>
                                {theme.palette.mode === 'dark' ? (
                                    <DarkModeOutlined sx={{ fontSize: '25px' }} />
                                ) : (
                                    <LightModeOutlined sx={{ color: dark, fontSize: '25px' }} />
                                )}
                            </IconButton>
                        </Box>

                        <FormControl variant="standard">
                            <Select
                                value={language}
                                sx={{
                                    backgroundColor: neutralLight,
                                    borderRadius: '0.25rem',
                                    p: '0.25rem 0.7rem',
                                    '& .MuiSvgIcon-root': {
                                        pr: '0.25rem',
                                    },
                                    '& .MuiSelect-select:focus': {
                                        backgroundColor: neutralLight,
                                    },
                                }}
                                input={<InputBase />}
                            >
                                <MenuItem value={LANGUAGES.VI} onClick={() => handleChangeLanguage(LANGUAGES.VI)}>
                                    <Typography>{LANGUAGES.VI}</Typography>
                                </MenuItem>
                                <MenuItem value={LANGUAGES.EN} onClick={() => handleChangeLanguage(LANGUAGES.EN)}>
                                    <Typography>{LANGUAGES.EN}</Typography>
                                </MenuItem>
                            </Select>
                        </FormControl>

                        {isLoggedIn ? (
                            <FormControl variant="standard">
                                <Select
                                    value={name}
                                    sx={{
                                        backgroundColor: neutralLight,
                                        borderRadius: '0.25rem',
                                        p: '0.25rem 1rem',
                                        '& .MuiSvgIcon-root': {
                                            pr: '0.25rem',
                                            width: '3rem',
                                        },
                                        '& .MuiSelect-select:focus': {
                                            backgroundColor: neutralLight,
                                        },
                                    }}
                                    input={<InputBase />}
                                >
                                    <MenuItem value={name}>
                                        <Typography>{name}</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleNavigateDashboard()}>
                                        <Typography>
                                            <FormattedMessage id="guest.header.dashboard" />
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleSignOut()}>
                                        <Typography>
                                            <FormattedMessage id="guest.header.signOut" />
                                        </Typography>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        ) : (
                            <Box display="flex" justifyContent="center">
                                <IconButton
                                    onClick={() => navigate(AUTH_PATHS.SIGN_IN)}
                                    aria-label="account"
                                    sx={{ color: theme.palette.mode !== 'dark' ? dark : '', fontSize: '25px' }}
                                >
                                    <AccountCircleOutlined />
                                </IconButton>
                            </Box>
                        )}
                    </Stack>
                </Drawer>
            </FlexBetween>
        </>
    );
};

export default Navbar;
