import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Box, Button, Divider, Drawer, Stack, Avatar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Home } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';

import PerfectScrollbar from 'react-perfect-scrollbar';

import { itemsAdmin } from 'config/navDashboardAdmin';
import { itemsUser } from 'config/navDashboardUser';
import { SideNavItem } from './SideNavItem';
import { GUEST_PATHS } from 'utils';

const SideNav = props => {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;
    const { open, onClose } = props;
    const lgUp = useMediaQuery(theme => theme.breakpoints.up('lg'));

    const { userInfo } = useSelector(state => state.auth);

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;

    const name = userInfo?.firstName;

    const items = userInfo ? (userInfo?.roleKey === 'R1' ? itemsAdmin : itemsUser) : [];

    const content = (
        <PerfectScrollbar>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Box
                        backgroundColor={neutralLight}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: '15px',
                            borderRadius: 1,
                            mt: 2,
                            p: '12px',
                        }}
                    >
                        <Avatar
                            sx={{
                                height: 60,
                                width: 60,
                            }}
                            src={userInfo?.avatarUrl || ''}
                        />
                        <Typography color="inherit" variant="subtitle1">
                            {name}
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <Box
                    component="nav"
                    sx={{
                        flexGrow: 1,
                        px: 2,
                        py: 3,
                    }}
                >
                    <Stack
                        component="ul"
                        spacing={1}
                        sx={{
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                    >
                        {items.map((item, index) => {
                            const active = item.path ? pathname === item.path : false;

                            return (
                                <SideNavItem
                                    key={index}
                                    active={active}
                                    icon={item.icon}
                                    path={item.path}
                                    title={item.title}
                                />
                            );
                        })}
                    </Stack>
                </Box>
                <Divider sx={{}} />
                <Box
                    sx={{
                        p: 2,
                    }}
                >
                    <Button
                        onClick={() => navigate(GUEST_PATHS.GUEST)}
                        endIcon={<Home />}
                        fullWidth
                        variant="contained"
                        color="info"
                    >
                        <FormattedMessage id="dashboardCommon.goGuest" />
                    </Button>
                </Box>
            </Box>
        </PerfectScrollbar>
    );

    if (lgUp) {
        return (
            <Drawer
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        width: 280,
                    },
                }}
                variant="permanent"
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor="left"
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    width: 280,
                },
            }}
            sx={{ zIndex: 999 }}
            variant="temporary"
        >
            {content}
        </Drawer>
    );
};

SideNav.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
};

export default SideNav;
