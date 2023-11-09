import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Unstable_Grid2 as Grid, IconButton, Card, CardHeader, Tooltip } from '@mui/material';
import {
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
    Edit,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { Image } from 'antd';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import _ from 'lodash';

import LoadingOverlay from 'components/common/LoadingOverlay';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { LANGUAGES } from 'utils';
import { getUserService } from 'services/usersService';
import DialogUpdateProfile from './DialogUpdateProfile';

const Profile = () => {
    const axiosPrivate = useAxiosPrivate();

    const language = useSelector(state => state.app.language || 'vi');
    const userId = useSelector(state => state.auth.userInfo?.id || '');

    const [profile, setProfile] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [currentProfile, setCurrentProfile] = useState(null);
    const [openDialogUpdate, setOpenDialogUpdate] = useState(false);

    const handleToggleDialogUpdate = () => {
        setOpenDialogUpdate(!openDialogUpdate);
    };

    const getUser = async () => {
        try {
            setIsLoading(true);
            const response = await getUserService(axiosPrivate, userId);
            if (response?.data?.data) {
                const user = response.data.data;
                setCurrentProfile(user);
                const profileData = [
                    {
                        icon: <Badge fontSize="large" />,
                        content:
                            language === LANGUAGES.VI
                                ? `${user?.lastName} ${user?.firstName}`
                                : `${user?.firstName} ${user?.lastName}`,
                        subtitle: <FormattedMessage id="dashboardAdmin.users.detail.name" />,
                    },
                    {
                        icon: <Email fontSize="large" />,
                        content: user?.email,
                        subtitle: <FormattedMessage id="dashboardAdmin.users.detail.email" />,
                    },
                    {
                        icon: <LocalPhone fontSize="large" />,
                        content: user?.phone,
                        subtitle: <FormattedMessage id="dashboardAdmin.users.detail.phone" />,
                    },
                    {
                        icon: <Transgender fontSize="large" />,
                        content: language === LANGUAGES.VI ? user?.genderData?.valueVi : user?.genderData?.valueEn,
                        subtitle: <FormattedMessage id="dashboardAdmin.users.detail.gender" />,
                    },
                    {
                        icon: <ContactEmergency fontSize="large" />,
                        content: user?.CIC,
                        subtitle: <FormattedMessage id="dashboardAdmin.users.detail.CIC" />,
                    },
                    {
                        icon: <Public fontSize="large" />,
                        content: user?.country,
                        subtitle: <FormattedMessage id="dashboardAdmin.users.detail.country" />,
                    },
                    {
                        icon: <Cake fontSize="large" />,
                        content: dayjs(user?.birthday).format('DD/MM/YYYY'),
                        subtitle: <FormattedMessage id="dashboardAdmin.users.detail.birthday" />,
                    },
                    {
                        icon: <ManageAccounts fontSize="large" />,
                        content: language === LANGUAGES.VI ? user?.roleData?.valueVi : user?.roleData?.valueEn,
                        subtitle: <FormattedMessage id="dashboardAdmin.users.detail.role" />,
                    },
                    {
                        icon: <LockPerson fontSize="large" />,
                        content:
                            language === LANGUAGES.VI ? user?.userStatusData?.valueVi : user?.userStatusData?.valueEn,
                        subtitle: <FormattedMessage id="dashboardAdmin.users.detail.userStatus" />,
                    },
                    {
                        icon: <AccessTimeFilled fontSize="large" />,
                        content: dayjs(user?.createdAt).format('DD/MM/YYYY'),
                        subtitle: <FormattedMessage id="dashboardAdmin.users.detail.createdAt" />,
                    },
                ];

                setProfile(profileData);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <LoadingOverlay isLoading={isLoading} />
            <Card>
                <Grid container spacing={4} p={2}>
                    <Grid container xs={12} lg={1} justifyContent="center">
                        <Grid>
                            <Tooltip title="Edit profile">
                                <IconButton onClick={() => handleToggleDialogUpdate()} size="large">
                                    <Edit fontSize="inherit" color="info" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>

                    <Grid container xs={12} lg={5} justifyContent="center">
                        <Grid xs={9} lg={10}>
                            <Image src={currentProfile?.avatarData?.url} alt="" />
                        </Grid>
                    </Grid>
                    <Grid xs={12} lg={6}>
                        <Card variant="outlined">
                            {!_.isEmpty(profile) &&
                                profile.map((item, index) => {
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
                    </Grid>
                </Grid>
                <DialogUpdateProfile
                    handleToggleDialogUpdate={handleToggleDialogUpdate}
                    openDialogUpdate={openDialogUpdate}
                    currentProfile={currentProfile}
                    getUser={getUser}
                    setIsLoading={setIsLoading}
                />
            </Card>
        </>
    );
};

export default Profile;
