import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from 'config/theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-perfect-scrollbar/dist/css/styles.css';

import { AUTH_PATHS, DASHBOARD_ADMIN_PATHS, DASHBOARD_USER_PATHS, GUEST_PATHS, NOT_FOUND } from 'utils';
import './App.css';

// Auth
import SignIn from 'containers/auth/SignIn';
import SignUp from 'containers/auth/SignUp';
import ForgotPassword from 'containers/auth/ForgotPassword';
import VerifyOTP from 'containers/auth/VerifyOTP';
import ResetPassword from 'containers/auth/ResetPassword';

// Admin
import AdminDashboard from 'containers/dashboardAdmin/dashboard/Dashboard';
import AdminTableAllCodes from 'containers/dashboardAdmin/allCodes/TableAllCodes';
import AdminTableServices from 'containers/dashboardAdmin/services/TableServices';
import AdminTableUsers from 'containers/dashboardAdmin/users/TableUsers';
import AdminTableRoomTypes from 'containers/dashboardAdmin/roomTypes/TableRoomTypes';
import AdminTableRooms from 'containers/dashboardAdmin/rooms/TableRooms';
import AdminTableBookings from 'containers/dashboardAdmin/bookings/TableBookings';
import AdminCalendar from 'containers/dashboardAdmin/calendar/Calendar';
import AdminTableHistories from 'containers/dashboardAdmin/histories/TableHistories';
import AdminTablePosts from 'containers/dashboardAdmin/posts/TablePosts';
import AdminMail from 'containers/dashboardAdmin/mail/Mail';
import AdminTableReviews from 'containers/dashboardAdmin/reviews/TableReviews';
import AdminSettings from 'containers/dashboardAdmin/settings/Settings';

// User
import UserTableBookings from 'containers/dashboardUser/bookings/TableBookings';
import UserProfile from 'containers/dashboardUser/profile/Profile';
import UserTableHistories from 'containers/dashboardUser/histories/TableHistories';
import UserTableReviews from 'containers/dashboardUser/reviews/TableReviews';
import UserSettings from 'containers/dashboardAdmin/settings/Settings';

// Guest
import GuestHomePage from 'containers/guest/homePage/HomePage';
import GuestRoomTypesList from 'containers/guest/roomTypesList/RoomTypesList';
import GuestRoomTypeDetail from 'containers/guest/roomTypeDetail/RoomTypeDetail';
import GuestBooking from 'containers/guest/booking/Booking';
import GuestVerifyBooking from 'containers/guest/booking/VerifyBooking';
import GuestPaymentStatusVnpay from 'containers/guest/booking/PaymentStatusVnpay';
import GuestGallery from 'containers/guest/gallery/Gallery';
import GuestPosts from 'containers/guest/posts/Posts';

// chat real times
import ChatRealTimes from 'containers/chatRealTimes/ChatRealTimes';

// *
import NotFound from 'components/common/NotFound';

// Layout
import GuestLayout from 'layouts/GuestLayout';
import DashboardLayout from 'layouts/DashboardLayout';
import DashboardLayoutUser from 'layouts/DashboardLayoutUser';
import AuthLayout from 'layouts/AuthLayout';

const App = () => {
    const { userInfo, isLoggedIn } = useSelector(state => state.auth);
    const mode = useSelector(state => state.app.mode);
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        setShouldRender(true);
    }, [userInfo, isLoggedIn]);

    useEffect(() => {
        if (shouldRender) {
            setShouldRender(false);
        }
    }, [shouldRender]);

    return (
        <>
            <Router>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Routes>
                        {/* Guest */}
                        <Route path={GUEST_PATHS.GUEST} element={<GuestLayout />}>
                            <Route index element={<GuestHomePage />} />
                            <Route path={GUEST_PATHS.ROOM_TYPES_LIST} element={<GuestRoomTypesList />} />
                            <Route path={GUEST_PATHS.ROOM_TYPE_DETAIL} element={<GuestRoomTypeDetail />} />
                            <Route path={GUEST_PATHS.BOOKING} element={<GuestBooking />} />
                            <Route path={GUEST_PATHS.VERIFY_EMAIL_BOOKING} element={<GuestVerifyBooking />} />
                            <Route path={GUEST_PATHS.STATUS_PAYMENT_VNPAY} element={<GuestPaymentStatusVnpay />} />
                            <Route path={GUEST_PATHS.POSTS} element={<GuestPosts />} />
                            <Route path={GUEST_PATHS.GALLERY} element={<GuestGallery />} />
                        </Route>
                        {/* Admin */}
                        <Route path={DASHBOARD_ADMIN_PATHS.DASHBOARD} element={<DashboardLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path={DASHBOARD_ADMIN_PATHS.ALL_CODES} element={<AdminTableAllCodes />} />
                            <Route path={DASHBOARD_ADMIN_PATHS.SERVICES} element={<AdminTableServices />} />
                            <Route path={DASHBOARD_ADMIN_PATHS.USERS} element={<AdminTableUsers />} />
                            <Route path={DASHBOARD_ADMIN_PATHS.ROOM_TYPES} element={<AdminTableRoomTypes />} />
                            <Route path={DASHBOARD_ADMIN_PATHS.ROOMS} element={<AdminTableRooms />} />
                            <Route path={DASHBOARD_ADMIN_PATHS.BOOKINGS} element={<AdminTableBookings />} />
                            <Route path={DASHBOARD_ADMIN_PATHS.CALENDAR} element={<AdminCalendar />} />
                            <Route path={DASHBOARD_ADMIN_PATHS.HISTORIES} element={<AdminTableHistories />} />
                            <Route path={DASHBOARD_ADMIN_PATHS.POSTS} element={<AdminTablePosts />} />
                            <Route path={DASHBOARD_ADMIN_PATHS.MAIL} element={<AdminMail />} />
                            <Route path={DASHBOARD_ADMIN_PATHS.REVIEWS} element={<AdminTableReviews />} />
                            <Route path={DASHBOARD_ADMIN_PATHS.SETTINGS} element={<AdminSettings />} />
                            <Route path={DASHBOARD_ADMIN_PATHS.CHAT_REAL_TIMES} element={<ChatRealTimes />} />
                        </Route>
                        {/* User */}
                        <Route path={DASHBOARD_USER_PATHS.DASHBOARD} element={<DashboardLayoutUser />}>
                            <Route index element={<Navigate to={DASHBOARD_USER_PATHS.BOOKINGS} />} />
                            <Route path={DASHBOARD_USER_PATHS.BOOKINGS} element={<UserTableBookings />} />
                            <Route path={DASHBOARD_USER_PATHS.PROFILE} element={<UserProfile />} />
                            <Route path={DASHBOARD_USER_PATHS.HISTORIES} element={<UserTableHistories />} />
                            <Route path={DASHBOARD_USER_PATHS.REVIEWS} element={<UserTableReviews />} />
                            <Route path={DASHBOARD_USER_PATHS.SETTINGS} element={<UserSettings />} />
                            <Route path={DASHBOARD_USER_PATHS.CHAT_REAL_TIMES} element={<ChatRealTimes />} />
                        </Route>
                        {/* Auth */}
                        <Route element={<AuthLayout />}>
                            <Route path={AUTH_PATHS.SIGN_IN} element={<SignIn />} />
                            <Route path={AUTH_PATHS.SIGN_UP} element={<SignUp />} />
                            <Route path={AUTH_PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
                            <Route path={AUTH_PATHS.VERIFY_OTP} element={<VerifyOTP />} />
                            <Route path={AUTH_PATHS.RESET_PASSWORD} element={<ResetPassword />} />
                        </Route>

                        {/* * */}
                        <Route path="*" element={<Navigate to={NOT_FOUND} />} />
                        <Route path={NOT_FOUND} element={<NotFound />} />
                    </Routes>
                </ThemeProvider>
            </Router>

            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
};

export default App;
