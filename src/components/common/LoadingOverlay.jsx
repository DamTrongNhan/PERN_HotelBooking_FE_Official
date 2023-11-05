import { Backdrop, CircularProgress } from '@mui/material';

const LoadingOverlay = ({ isLoading }) => {
    return (
        <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoadingOverlay;
