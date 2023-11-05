import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Unstable_Grid2 as Grid, useTheme, Button } from '@mui/material';

import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';

import LoadingOverlay from 'components/common/LoadingOverlay';

const RoomList = () => {
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    // const getAllRoomsByTypeKey = async () => {
    //     try {
    //         setLoadingAllRoomsByTypeKey(true);
    //         const response = await getAllRoomsByTypeKeyService(roomTypeKey);
    //         if (response?.data) {
    //             setLoadingAllRoomsByTypeKey(false);
    //             setAllRoomsByTypeKey(response.data);
    //         }
    //     } catch (error) {
    //         if (error.response && error.response.data && error.response.data.message) {
    //             toast.error(error.response.data.message);
    //         } else {
    //             toast.error(error.message);
    //         }
    //         setLoadingAllRoomsByTypeKey(false);
    //     } finally {
    //         setLoadingAllRoomsByTypeKey(false);
    //     }
    // };

    useEffect(() => {
        // getAllRoomsByTypeKey();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {/* <LoadingOverlay isLoading={loadingAllRoomsByTypeKey} /> */}
            <Box></Box>
        </>
    );
};
export default RoomList;
