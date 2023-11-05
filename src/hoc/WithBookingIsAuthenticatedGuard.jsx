import { BookingIsAuthenticatedGuard } from 'guards/BookingIsAuthenticatedGuard';

export const WithBookingIsAuthenticatedGuard = Component => props =>
    (
        <BookingIsAuthenticatedGuard>
            <Component {...props} />
        </BookingIsAuthenticatedGuard>
    );
