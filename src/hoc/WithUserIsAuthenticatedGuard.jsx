import { UserIsAuthenticatedGuard } from 'guards/UserIsAuthenticatedGuard';

export const WithUserIsAuthenticatedGuard = Component => props =>
    (
        <UserIsAuthenticatedGuard>
            <Component {...props} />
        </UserIsAuthenticatedGuard>
    );
