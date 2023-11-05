import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

export const SideNavItem = props => {
    const { active = false, icon, path, title } = props;
    const navigate = useNavigate();

    return (
        <li>
            <Button
                variant={active ? 'contained' : ''}
                color="info"
                fullWidth
                sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                }}
                startIcon={icon}
                onClick={() => navigate(path)}
            >
                {title}
            </Button>
        </li>
    );
};

SideNavItem.propTypes = {
    active: PropTypes.bool,
    icon: PropTypes.node,
    path: PropTypes.string,
    title: PropTypes.node,
};
