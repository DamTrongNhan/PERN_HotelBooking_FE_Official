import { History, BookOnline, AccountBox, RateReview } from '@mui/icons-material';
import { DASHBOARD_USER_PATHS } from 'utils';
import { FormattedMessage } from 'react-intl';

export const itemsUser = [
    {
        title: <FormattedMessage id="dashboardUser.navSideBar.profile" />,
        path: DASHBOARD_USER_PATHS.PROFILE,
        icon: <AccountBox />
    },

    {
        title: <FormattedMessage id="dashboardUser.navSideBar.booking" />,
        path: DASHBOARD_USER_PATHS.BOOKING,
        icon: <BookOnline />
    },

    {
        title: <FormattedMessage id="dashboardUser.navSideBar.bookingHistories" />,
        path: DASHBOARD_USER_PATHS.BOOKING_HISTORIES,
        icon: <History />
    },
    {
        title: <FormattedMessage id="dashboardUser.navSideBar.reviews" />,
        path: DASHBOARD_USER_PATHS.REVIEWS,
        icon: <RateReview />
    }
];
