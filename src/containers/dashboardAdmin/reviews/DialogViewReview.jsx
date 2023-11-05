import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Dialog, DialogTitle, DialogContent, IconButton, Card, Typography, Rating, CardHeader } from '@mui/material';
import { Cancel, AccessTimeFilled, Email, Badge, MeetingRoom, Reviews, RateReview } from '@mui/icons-material';

import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import _ from 'lodash';

import HeaderComponent from 'components/dashboard/HeaderComponent';

import { LANGUAGES } from 'utils';
import { useEffect, useState } from 'react';

const DialogViewReview = props => {
    const { openDialogView, handleToggleDialogView, currentReview = {} } = props;

    const language = useSelector(state => state.app.language || 'vi');

    const [details, setDetails] = useState([]);

    useEffect(() => {
        if (openDialogView && !_.isEmpty(currentReview)) {
            const name =
                language === LANGUAGES.VI
                    ? `${currentReview?.userDataReviews?.lastName} ${currentReview?.userDataReviews?.firstName}`
                    : `${currentReview?.userDataReviews?.firstName} ${currentReview?.userDataReviews?.lastName}`;

            const createTime = dayjs(currentReview?.createdAt).format('DD/MM/YYYY');

            const details = [
                {
                    icon: <MeetingRoom fontSize="large" />,
                    content:
                        LANGUAGES.VI === language
                            ? currentReview?.roomTypesDataReviews?.roomTypeDataRoomTypes?.valueVi
                            : currentReview?.roomTypesDataReviews?.roomTypeDataRoomTypes?.valueEn,
                    subtitle: <FormattedMessage id="dashboardAdmin.reviews.details.roomType" />,
                },
                {
                    icon: <Badge fontSize="large" />,
                    content: name,
                    subtitle: <FormattedMessage id="dashboardAdmin.reviews.details.userName" />,
                },
                {
                    icon: <Email fontSize="large" />,
                    content: currentReview?.userDataReviews?.email,
                    subtitle: <FormattedMessage id="dashboardAdmin.reviews.details.userEmail" />,
                },
                {
                    icon: <Reviews fontSize="large" />,
                    content: <Rating name="read-only" value={currentReview?.star} readOnly />,
                    subtitle: <FormattedMessage id="dashboardAdmin.reviews.details.star" />,
                },
                {
                    icon: <RateReview fontSize="large" />,
                    content: <Typography>{currentReview?.review}</Typography>,
                    subtitle: <FormattedMessage id="dashboardAdmin.reviews.details.review" />,
                },
                {
                    icon: <AccessTimeFilled fontSize="large" />,
                    content: createTime,
                    subtitle: <FormattedMessage id="dashboardAdmin.reviews.details.createdAt" />,
                },
            ];

            setDetails(details);
        }
    }, [openDialogView, currentReview, language]);

    return (
        <>
            {openDialogView && (
                <Dialog
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        style: {
                            width: '90%',
                        },
                    }}
                    open={openDialogView}
                    onClose={handleToggleDialogView}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle
                        id="form-dialog-title"
                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
                    >
                        <HeaderComponent
                            title={<FormattedMessage id="dashboardAdmin.reviews.title" />}
                            subtitle={<FormattedMessage id="dashboardAdmin.reviews.viewSubtitle" />}
                        />
                        <IconButton onClick={() => handleToggleDialogView()} size="large">
                            <Cancel fontSize="inherit" />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Card>
                            {details &&
                                details.map((item, index) => {
                                    return (
                                        <CardHeader
                                            key={index}
                                            avatar={item.icon}
                                            title={item.content}
                                            subheader={item.subtitle}
                                        />
                                    );
                                })}
                        </Card>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

DialogViewReview.propTypes = {
    openDialogView: PropTypes.bool,
    handleToggleDialogView: PropTypes.func,
    currentReview: PropTypes.object,
};
export default DialogViewReview;
