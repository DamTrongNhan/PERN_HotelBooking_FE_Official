import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, ButtonBase, useTheme, Button } from '@mui/material';

export const SideNavItem = props => {
    const { active = false, icon, path, title } = props;
    const navigate = useNavigate();

    const theme = useTheme();
    const primaryLight = theme.palette.primary.light;
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const alt = theme.palette.background.alt;

    return (
        <li>
            <Button
                variant={active ? 'contained' : ''}
                color="info"
                fullWidth
                sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none'
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
    title: PropTypes.node
};
