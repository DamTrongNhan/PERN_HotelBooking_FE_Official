import { AdminIsAuthenticatedGuard } from 'guards/AdminIsAuthenticatedGuard';

export const WithAdminIsAuthenticatedGuard = Component => props =>
    (
        <AdminIsAuthenticatedGuard>
            <Component {...props} />
        </AdminIsAuthenticatedGuard>
    );
