import {
    History,
    BarChart,
    Group,
    Bed,
    Edit,
    Email,
    BookOnline,
    BusinessCenter,
    Code,
    ThumbUpAlt,
    Hotel,
    Event,
    RecordVoiceOver,
    Cancel,
} from '@mui/icons-material';

import { DASHBOARD_ADMIN_PATHS } from 'utils';
import { FormattedMessage } from 'react-intl';

export const itemsAdmin = [
    {
        title: <FormattedMessage id="dashboardAdmin.navSideBar.chart" />,
        path: DASHBOARD_ADMIN_PATHS.DASHBOARD,
        icon: <BarChart />,
    },
    {
        title: <FormattedMessage id="dashboardAdmin.navSideBar.code" />,
        path: DASHBOARD_ADMIN_PATHS.ALL_CODES,
        icon: <Code />,
    },
    {
        title: <FormattedMessage id="dashboardAdmin.navSideBar.services" />,
        path: DASHBOARD_ADMIN_PATHS.SERVICES,
        icon: <BusinessCenter />,
    },
    {
        title: <FormattedMessage id="dashboardAdmin.navSideBar.users" />,
        path: DASHBOARD_ADMIN_PATHS.USERS,
        icon: <Group />,
    },
    {
        title: <FormattedMessage id="dashboardAdmin.navSideBar.roomTypes" />,
        path: DASHBOARD_ADMIN_PATHS.ROOM_TYPES,
        icon: <Hotel />,
    },
    {
        title: <FormattedMessage id="dashboardAdmin.navSideBar.rooms" />,
        path: DASHBOARD_ADMIN_PATHS.ROOMS,
        icon: <Bed />,
    },
    {
        title: <FormattedMessage id="dashboardAdmin.navSideBar.bookings" />,
        path: DASHBOARD_ADMIN_PATHS.BOOKINGS,
        icon: <BookOnline />,
    },
    {
        title: <FormattedMessage id="dashboardAdmin.navSideBar.histories" />,
        path: DASHBOARD_ADMIN_PATHS.HISTORIES,
        icon: <History />,
    },
    {
        title: <FormattedMessage id="dashboardAdmin.navSideBar.cancelled" />,
        path: DASHBOARD_ADMIN_PATHS.CANCELLED,
        icon: <Cancel />,
    },
    {
        title: <FormattedMessage id="dashboardAdmin.navSideBar.calendar" />,
        path: DASHBOARD_ADMIN_PATHS.CALENDAR,
        icon: <Event />,
    },
    {
        title: <FormattedMessage id="dashboardAdmin.navSideBar.reviews" />,
        path: DASHBOARD_ADMIN_PATHS.REVIEWS,
        icon: <ThumbUpAlt />,
    },
    {
        title: <FormattedMessage id="dashboardAdmin.navSideBar.chat" />,
        path: DASHBOARD_ADMIN_PATHS.CHAT_REAL_TIMES,
        icon: <RecordVoiceOver />,
    },
    // {
    //     title: <FormattedMessage id="dashboardAdmin.navSideBar.mail" />,
    //     path: DASHBOARD_ADMIN_PATHS.MAIL,
    //     icon: <Email />,
    // },
    // {
    //     title: <FormattedMessage id="dashboardAdmin.navSideBar.posts" />,
    //     path: DASHBOARD_ADMIN_PATHS.POSTS,
    //     icon: <Edit />,
    // },
];
