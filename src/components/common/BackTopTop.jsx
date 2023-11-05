import { useState, useEffect } from 'react';

import { Fab, Box, Zoom } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        setIsVisible(scrollTop > 300);
    };

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Zoom in={isVisible}>
            <Box sx={{ position: 'fixed', bottom: '16px', right: '80px' }}>
                <Fab color="primary" size="small" onClick={handleScrollToTop}>
                    <KeyboardArrowUp />
                </Fab>
            </Box>
        </Zoom>
    );
}

export default BackToTop;
