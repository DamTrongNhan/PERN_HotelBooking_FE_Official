import PropTypes from 'prop-types';
import { Typography, Box } from '@mui/material';

const HeaderComponent = ({ title, subtitle }) => {
    return (
        <Box mb="30px">
            <Typography variant="h2" fontWeight="bold" sx={{ m: '0 0 10px 0' }}>
                {title}
            </Typography>
            <Typography variant="h5">{subtitle}</Typography>
        </Box>
    );
};

export default HeaderComponent;
HeaderComponent.propTypes = {
    title: PropTypes.node,
    subtitle: PropTypes.node,
};
