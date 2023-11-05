export const AUTH_PATHS = {
    SIGN_IN: '/signIn',
    SIGN_UP: '/signUp',
    FORGOT_PASSWORD: '/forgotPassword',
    VERIFY_OTP: '/verifyOTP',
    RESET_PASSWORD: '/resetPassword',
};
export const GUEST_PATHS = {
    GUEST: '/',
    ROOM_TYPES_LIST: '/roomTypesList',
    ROOM_TYPE_DETAIL: '/roomTypeDetail/:roomTypeId',
    ROOM_TYPE_DETAIL_NO_ID: '/roomTypeDetail/',
    BOOKING: '/booking/:roomId',
    BOOKING_NO_ID: '/booking/',
    VERIFY_EMAIL_BOOKING: '/verify-booking',
    STATUS_PAYMENT_VNPAY: '/payment-status-vnpay',
    POSTS: '/posts',
    GALLERY: '/gallery',
};
export const DASHBOARD_ADMIN_PATHS = {
    DASHBOARD: '/dashBoardAdmin',
    CHART: '/dashBoardAdmin/chart',
    ALL_CODES: '/dashBoardAdmin/allCodes',
    SERVICES: '/dashBoardAdmin/services',
    USERS: '/dashBoardAdmin/users',
    ROOM_TYPES: '/dashBoardAdmin/roomTypes',
    ROOMS: '/dashBoardAdmin/rooms',
    BOOKINGS: '/dashBoardAdmin/bookings',
    CALENDAR: '/dashBoardAdmin/calendar',
    HISTORIES: '/dashBoardAdmin/histories',
    POSTS: '/dashBoardAdmin/posts',
    REVIEWS: '/dashBoardAdmin/reviews',
    MAIL: '/dashBoardAdmin/sendAd',
    SETTINGS: '/dashBoardAdmin/settings',
    CHAT_REAL_TIMES: '/dashBoardAdmin/chatRealTimes',
};
// Child user
export const DASHBOARD_USER_PATHS = {
    DASHBOARD: '/dashBoardUser',
    BOOKINGS: '/dashBoardUser/bookings',
    PROFILE: '/dashBoardUser/profile',
    HISTORIES: '/dashBoardUser/histories',
    REVIEWS: '/dashBoardUser/reviews',
    SETTINGS: '/dashBoardUser/settings',
    CHAT_REAL_TIMES: '/dashBoardUser/chatRealTimes',
};
export const NOT_FOUND = 'notFound';

export const LANGUAGES = {
    VI: 'vi',
    EN: 'en',
};
