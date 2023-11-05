import { UserIsNotAuthenticatedGuard } from 'guards/UserIsNotAuthenticatedGuard';

export const WithUserIsNotAuthenticatedGuard = Component => props =>
    (
        <UserIsNotAuthenticatedGuard>
            <Component {...props} />
        </UserIsNotAuthenticatedGuard>
    );
