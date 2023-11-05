import { useState } from 'react';

import { Backdrop, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { Facebook, Call, SmartToy, Share } from '@mui/icons-material/';

const actions = [
    { icon: <Facebook />, name: 'Facebook' },
    { icon: <Call />, name: 'Contact' },
    { icon: <SmartToy />, name: 'Chat' },
    { icon: <Share />, name: 'Share' }
];

const SpeedDialTooltipOpen = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Backdrop open={open} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
            >
                {actions.map(action => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={handleClose}
                    />
                ))}
            </SpeedDial>
        </>
    );
};
export default SpeedDialTooltipOpen;
