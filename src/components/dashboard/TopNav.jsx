import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    Badge,
    Box,
    IconButton,
    Stack,
    SvgIcon,
    Tooltip,
    useMediaQuery,
    useTheme,
    InputBase,
    Popper,
    Fade,
    Paper,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import {
    Widgets,
    Search,
    NotificationsNoneOutlined,
    SettingsOutlined,
    DarkModeOutlined,
    LightModeOutlined,
    LogoutOutlined,
    Language,
} from '@mui/icons-material';

import { toast } from 'react-toastify';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';

import LoadingOverlay from 'components/common/LoadingOverlay';
import FlexBetween from 'components/common/FlexBetween';

import { changeMode, changeLanguage } from 'store/slice/appSlice';
import { removeUserInfo } from 'store/slice/authSlice';
import { updateSelectedChat, updateNotifications, removeChatState } from 'store/slice/chatSlice';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { signOutService } from 'services/authServices';

import { DASHBOARD_ADMIN_PATHS, DASHBOARD_USER_PATHS, GUEST_PATHS, LANGUAGES, getPartnerInfo } from 'utils';

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

const TopNav = props => {
    const { onNavOpen } = props;
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const lgUp = useMediaQuery(theme => theme.breakpoints.up('lg'));

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;

    const [isLoading, setIsLoading] = useState(false);

    const language = useSelector(state => state.app.language);
    const id = useSelector(state => state.auth.userInfo?.id || '');
    const roleKey = useSelector(state => state.auth.userInfo?.roleKey || '');
    const { notifications = [] } = useSelector(state => state.chat);

    const [anchorElLanguageDesk, setAnchorElLanguageDesk] = useState(null);
    const [openLanguageDesk, setOpenLanguageDesk] = useState(false);

    const [anchorElNotificationsDesk, setAnchorElNotificationsDesk] = useState(null);
    const [openNotificationsDesk, setOpenNotificationsDesk] = useState(false);

    const handleOpenLanguageDesk = event => {
        setAnchorElLanguageDesk(event.currentTarget);
        setOpenLanguageDesk(previousOpen => !previousOpen);
    };

    const handleOpenNotificationsDesk = event => {
        setAnchorElNotificationsDesk(event.currentTarget);
        setOpenNotificationsDesk(previousOpen => !previousOpen);
    };

    const handleNavigateSettings = () => {
        if (roleKey === 'R1') {
            navigate(DASHBOARD_ADMIN_PATHS.SETTINGS);
        } else if (roleKey === 'R2') {
            navigate(DASHBOARD_USER_PATHS.SETTINGS);
        }
    };
    const handleNavigateChat = () => {
        if (roleKey === 'R1') {
            navigate(DASHBOARD_ADMIN_PATHS.CHAT_REAL_TIMES);
        } else if (roleKey === 'R2') {
            navigate(DASHBOARD_USER_PATHS.CHAT_REAL_TIMES);
        }
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

    return (
        <>
            <LoadingOverlay isLoading={isLoading} />

            <Box
                component="header"
                sx={{
                    backdropFilter: 'blur(6px)',
                    position: 'sticky',
                    left: {
                        lg: `${SIDE_NAV_WIDTH}px`,
                    },
                    top: 0,
                    width: {
                        lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
                    },
                    zIndex: 999,
                }}
            >
                <Stack
                    alignItems="center"
                    justifyContent="space-between"
                    direction="row"
                    sx={{
                        minHeight: TOP_NAV_HEIGHT,
                        px: 2,
                    }}
                >
                    <Stack alignItems="center" direction="row" spacing={2}>
                        {!lgUp ? (
                            <>
                                <IconButton onClick={onNavOpen}>
                                    <SvgIcon>
                                        <Widgets />
                                    </SvgIcon>
                                </IconButton>
                                <Tooltip title="Search">
                                    <IconButton>
                                        <SvgIcon>
                                            <Search />
                                        </SvgIcon>
                                    </IconButton>
                                </Tooltip>
                            </>
                        ) : (
                            <FlexBetween
                                backgroundColor={neutralLight}
                                borderRadius="9px"
                                gap="0.8rem"
                                padding="0.1rem 1.3rem"
                            >
                                <InputBase placeholder="Search..." />
                                <IconButton>
                                    <Search />
                                </IconButton>
                            </FlexBetween>
                        )}
                    </Stack>
                    <Stack alignItems="center" direction="row" spacing={2}>
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
                                                onClick={() => dispatch(changeLanguage(LANGUAGES.VI))}
                                                variant={LANGUAGES.VI === language ? 'contained' : ''}
                                                color="secondary"
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Vietnamese
                                            </Button>
                                            <Button
                                                onClick={() => dispatch(changeLanguage(LANGUAGES.EN))}
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
                        <Tooltip title="Dark/Light mode">
                            <IconButton onClick={() => dispatch(changeMode())}>
                                {theme.palette.mode === 'dark' ? (
                                    <DarkModeOutlined sx={{ fontSize: '25px' }} />
                                ) : (
                                    <LightModeOutlined sx={{ color: dark, fontSize: '25px' }} />
                                )}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Notifications">
                            <IconButton>
                                <Badge badgeContent={notifications.length} color="secondary">
                                    <NotificationsNoneOutlined onClick={handleOpenNotificationsDesk} />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Popper open={openNotificationsDesk} anchorEl={anchorElNotificationsDesk} transition>
                            {({ TransitionProps }) => (
                                <Fade {...TransitionProps} timeout={350}>
                                    <Paper elevation={6} sx={{ mt: 2, p: 2 }}>
                                        <List>
                                            {!_.isEmpty(notifications) ? (
                                                notifications.map((notification, index) => (
                                                    <ListItem key={index} alignItems="flex-start" divider>
                                                        <ListItemText
                                                            sx={{ cursor: 'pointer' }}
                                                            onClick={() => {
                                                                dispatch(updateSelectedChat(notification));
                                                                dispatch(
                                                                    updateNotifications(
                                                                        notifications.filter(n => n !== notification)
                                                                    )
                                                                );
                                                                handleNavigateChat();
                                                            }}
                                                            primary={getPartnerInfo(id, notification)?.firstName}
                                                            secondary={
                                                                <FormattedMessage id="dashboardAdmin.chatRealTimes.message" />
                                                            }
                                                        />
                                                    </ListItem>
                                                ))
                                            ) : (
                                                <Typography variant="body2">
                                                    <FormattedMessage id="dashboardAdmin.chatRealTimes.noMessages" />
                                                </Typography>
                                            )}
                                        </List>
                                    </Paper>
                                </Fade>
                            )}
                        </Popper>
                        <Tooltip title="Settings">
                            <IconButton onClick={() => handleNavigateSettings()}>
                                <SettingsOutlined />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Sign out">
                            <IconButton onClick={() => handleSignOut()}>
                                <LogoutOutlined />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            </Box>
        </>
    );
};

TopNav.propTypes = {
    onNavOpen: PropTypes.func,
};
export default TopNav;
