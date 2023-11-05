import * as React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Tabs, Tab, Pagination, Stack, Box, Unstable_Grid2 as Grid, Skeleton, Zoom } from '@mui/material';

import { Image } from 'antd';
import { toast } from 'react-toastify';

import { getAllGalleryService } from 'services/roomTypesService';

const CustomTabPanel = props => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const a11yProps = index => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

const Gallery = () => {
    const [tab, setTab] = useState(0);

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(0);

    const PER_PAGE = 4;

    const [allGallery, setAllGallery] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };

    const handleChangePage = (event, page) => {
        setPage(page);
    };

    const getAllGallery = async () => {
        try {
            setIsLoading(true);
            const response = await getAllGalleryService(page, PER_PAGE);
            if (response) {
                setIsLoading(false);

                setAllGallery(response.data);

                setSize(response?.totalPages ? response.totalPages : 0);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllGallery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);
    return (
        <>
            <Box p={3}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
                        <Tab label="Room types" {...a11yProps(0)} />
                        <Tab label="Hotel" {...a11yProps(1)} />
                        <Tab label="Amenities" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={tab} index={0}>
                    <Grid mb={2} container xs={12} lg={12} spacing={1}>
                        {(isLoading ? Array.from(new Array(4)) : allGallery).map((item, index) => (
                            <Grid key={index} xs={6} lg={3}>
                                {item ? (
                                    <Image src={item.url} alt={item.type} />
                                ) : (
                                    <Zoom in={true}>
                                        <Skeleton animation="wave" variant="rectangular" width="100%" height={250} />
                                    </Zoom>
                                )}
                            </Grid>
                        ))}
                    </Grid>

                    <Box display="flex" justifyContent="center">
                        <Stack spacing={2}>
                            <Pagination count={size} page={page} onChange={handleChangePage} />
                        </Stack>
                    </Box>
                </CustomTabPanel>

                <CustomTabPanel value={tab} index={1}>
                    Hotel
                </CustomTabPanel>
                <CustomTabPanel value={tab} index={2}>
                    Amenities
                </CustomTabPanel>
            </Box>
        </>
    );
};
export default Gallery;
