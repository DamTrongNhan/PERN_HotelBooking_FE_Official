import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Box, Typography, useTheme, Button, CardMedia, Card, CardActions, CardContent } from '@mui/material';

import { toast } from 'react-toastify';
import _ from 'lodash';
// import * as DOMPurify from 'dompurify';

import LoadingOverlay from 'components/common/LoadingOverlay';

import { getAllServices_Service } from 'services/services_Service';

import { LANGUAGES } from 'utils';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import './custom-swiper.css';

const Promotion = () => {
    const theme = useTheme();
    const language = useSelector(state => state.app.language);

    const neutralLight = theme.palette.neutral.light;

    const [isLoading, setIsLoading] = useState(false);
    const [allServices, setAllServices] = useState([]);

    useEffect(() => {
        const getAllServices = async () => {
            try {
                setIsLoading(true);
                const response = await getAllServices_Service();
                if (response?.data) {
                    setIsLoading(false);
                    setAllServices(response.data);
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
        getAllServices();
    }, []);

    return (
        <>
            <LoadingOverlay isLoading={isLoading} />
            <Box backgroundColor={neutralLight} py={8} px={6}>
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    pagination={{ clickable: true }}
                    modules={[EffectCoverflow, Pagination]}
                    className="swiper_container"
                >
                    {!_.isEmpty(allServices) &&
                        allServices.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            pt: '56.25%',
                                        }}
                                        image={item?.thumbnailDataServices?.url}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {LANGUAGES.VI === language ? item?.titleVi : item?.titleEn}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button variant="outlined" color="info" size="small">
                                            View
                                        </Button>
                                        <Button variant="outlined" color="error" size="small">
                                            New
                                        </Button>
                                    </CardActions>
                                </Card>
                            </SwiperSlide>
                        ))}
                </Swiper>
            </Box>
        </>
    );
};
export default Promotion;
