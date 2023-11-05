import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Unstable_Grid2 as Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    styled,
    Card,
    CardHeader,
    Collapse,
} from '@mui/material';
import {
    Cancel,
    ContactEmergency,
    Cake,
    Public,
    AccessTimeFilled,
    Email,
    Badge,
    Transgender,
    LocalPhone,
    ManageAccounts,
    LockPerson,
    ExpandMore,
} from '@mui/icons-material';

import { Image } from 'antd';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import _ from 'lodash';

import HeaderComponent from 'components/dashboard/HeaderComponent';

import { LANGUAGES } from 'utils';

const DialogViewUser = props => {
    const { openDialogView, handleToggleDialogView, currentUser = {} } = props;

    const language = useSelector(state => state.app.language || 'vi');

    const [mainDetail, setMainDetail] = useState([]);
    const [detail, setDetail] = useState([]);

    useEffect(() => {
        if (openDialogView && !_.isEmpty(currentUser)) {
            const name =
                language === LANGUAGES.VI
                    ? `${currentUser?.lastName} ${currentUser?.firstName}`
                    : `${currentUser?.firstName} ${currentUser?.lastName}`;

            const birthday = dayjs(currentUser?.birthday).format('DD/MM/YYYY');

            const gender =
                language === LANGUAGES.VI ? currentUser?.genderData?.valueVi : currentUser?.genderData?.valueEn;

            const userStatus =
                language === LANGUAGES.VI ? currentUser?.userStatusData?.valueVi : currentUser?.userStatusData?.valueEn;

            const role = language === LANGUAGES.VI ? currentUser?.roleData?.valueVi : currentUser?.roleData?.valueEn;

            const createTime = dayjs(currentUser?.createdAt).format('DD/MM/YYYY');

            const mainDetail = [
                {
                    icon: <Badge fontSize="large" />,
                    content: name,
                    subtitle: <FormattedMessage id="dashboardAdmin.users.detail.name" />,
                },
                {
                    icon: <Email fontSize="large" />,
                    content: currentUser?.email,
                    subtitle: <FormattedMessage id="dashboardAdmin.users.detail.email" />,
                },
                {
                    icon: <LocalPhone fontSize="large" />,
                    content: currentUser?.phone,
                    subtitle: <FormattedMessage id="dashboardAdmin.users.detail.phone" />,
                },
            ];

            const detail = [
                {
                    icon: <Transgender fontSize="large" />,
                    content: gender,
                    subtitle: <FormattedMessage id="dashboardAdmin.users.detail.gender" />,
                },
                {
                    icon: <ContactEmergency fontSize="large" />,
                    content: currentUser?.CIC,
                    subtitle: <FormattedMessage id="dashboardAdmin.users.detail.CIC" />,
                },
                {
                    icon: <Public fontSize="large" />,
                    content: currentUser?.country,
                    subtitle: <FormattedMessage id="dashboardAdmin.users.detail.country" />,
                },
                {
                    icon: <Cake fontSize="large" />,
                    content: birthday,
                    subtitle: <FormattedMessage id="dashboardAdmin.users.detail.birthday" />,
                },
                {
                    icon: <ManageAccounts fontSize="large" />,
                    content: role,
                    subtitle: <FormattedMessage id="dashboardAdmin.users.detail.role" />,
                },
                {
                    icon: <LockPerson fontSize="large" />,
                    content: userStatus,
                    subtitle: <FormattedMessage id="dashboardAdmin.users.detail.userStatus" />,
                },
                {
                    icon: <AccessTimeFilled fontSize="large" />,
                    content: createTime,
                    subtitle: <FormattedMessage id="dashboardAdmin.users.detail.createdAt" />,
                },
            ];
            setMainDetail(mainDetail);
            setDetail(detail);
        }
    }, [openDialogView, currentUser, language]);

    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const ExpandMoreComponent = styled(props => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
    })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        margin: '0 auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    }));

    return (
        <>
            {openDialogView && (
                <Dialog
                    fullWidth
                    maxWidth="md"
                    PaperProps={{
                        style: {
                            width: '80%',
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
                            title={<FormattedMessage id="dashboardAdmin.users.title" />}
                            subtitle={<FormattedMessage id="dashboardAdmin.users.viewSubtitle" />}
                        />
                        <IconButton onClick={() => handleToggleDialogView()} size="large">
                            <Cancel fontSize="inherit" />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Card>
                            <Grid container spacing={4} p={2}>
                                <Grid xs={12} md={6}>
                                    <Image src={currentUser?.avatarData?.url} alt="" />
                                </Grid>
                                <Grid xs={12} md={6}>
                                    {mainDetail &&
                                        mainDetail.map((item, index) => {
                                            return (
                                                <CardHeader
                                                    key={index}
                                                    avatar={item.icon}
                                                    title={item.content}
                                                    subheader={item.subtitle}
                                                />
                                            );
                                        })}
                                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                                        <Grid xs={12} md={6}>
                                            {detail &&
                                                detail.map((item, index) => {
                                                    return (
                                                        <CardHeader
                                                            key={index}
                                                            avatar={item.icon}
                                                            title={item.content}
                                                            subheader={item.subtitle}
                                                        />
                                                    );
                                                })}
                                        </Grid>
                                    </Collapse>
                                    <ExpandMoreComponent
                                        expand={expanded}
                                        onClick={handleExpandClick}
                                        aria-expanded={expanded}
                                        aria-label="show more"
                                    >
                                        <ExpandMore />
                                    </ExpandMoreComponent>
                                </Grid>
                            </Grid>
                        </Card>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

DialogViewUser.propTypes = {
    openDialogView: PropTypes.bool,
    handleToggleDialogView: PropTypes.func,
    currentUser: PropTypes.object,
};
export default DialogViewUser;
