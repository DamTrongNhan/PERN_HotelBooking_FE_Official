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
    Typography,
} from '@mui/material';
import { Cancel, LocalAtm, ExpandMore, Key, Window, Title, AccessTime } from '@mui/icons-material';

import { Image } from 'antd';

import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import _ from 'lodash';
import * as DOMPurify from 'dompurify';

import HeaderComponent from 'components/dashboard/HeaderComponent';

import { LANGUAGES, formatCurrencyVND, formatCurrencyUSD } from 'utils';

const DialogViewService = props => {
    const { openDialogView, handleToggleDialogView, currentService = {} } = props;

    const language = useSelector(state => state.app.language || 'vi');

    const [detail, setDetail] = useState([]);

    const [descriptionVi, setDescriptionVi] = useState(null);
    const [descriptionEn, setDescriptionEn] = useState(null);

    useEffect(() => {
        if (openDialogView && !_.isEmpty(currentService)) {
            const detail = [
                {
                    icon: <Key fontSize="large" />,
                    content: currentService.keyMap,
                    subtitle: <FormattedMessage id="dashboardAdmin.services.details.keyMap" />,
                },
                {
                    icon: <Window fontSize="large" />,
                    content: currentService?.type,
                    subtitle: <FormattedMessage id="dashboardAdmin.services.details.type" />,
                },
                {
                    icon: <Title fontSize="large" />,
                    content: currentService?.titleVi,
                    subtitle: <FormattedMessage id="dashboardAdmin.services.details.titleVi" />,
                },
                {
                    icon: <Title fontSize="large" />,
                    content: currentService?.titleEn,
                    subtitle: <FormattedMessage id="dashboardAdmin.services.details.titleEn" />,
                },
                {
                    icon: <LocalAtm fontSize="large" />,
                    content:
                        language === LANGUAGES.VI
                            ? formatCurrencyVND(currentService?.price)
                            : formatCurrencyUSD(currentService?.price),
                    subtitle: <FormattedMessage id="dashboardAdmin.services.details.price" />,
                },
                {
                    icon: <AccessTime fontSize="large" />,
                    content: dayjs(currentService?.createdAt).format('DD/MM/YYYY'),
                    subtitle: <FormattedMessage id="dashboardAdmin.services.details.createdAt" />,
                },
            ];
            setDetail(detail);

            setDescriptionVi(DOMPurify.sanitize(currentService?.descriptionVi));
            setDescriptionEn(DOMPurify.sanitize(currentService?.descriptionEn));
        }
    }, [openDialogView, currentService, language]);

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
                            title={<FormattedMessage id="dashboardAdmin.services.title" />}
                            subtitle={<FormattedMessage id="dashboardAdmin.services.viewSubtitle" />}
                        />
                        <IconButton onClick={() => handleToggleDialogView()} size="large">
                            <Cancel fontSize="inherit" />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Card>
                            <Grid container spacing={4} p={2}>
                                <Grid xs={12} md={6}>
                                    <Image src={currentService?.thumbnailDataServices?.url} alt="" />
                                </Grid>
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
                                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                                        <Typography sx={{ color: 'grey' }}>
                                            <FormattedMessage id="dashboardAdmin.services.details.descriptionVi" />
                                        </Typography>
                                        <div dangerouslySetInnerHTML={{ __html: descriptionVi }} />
                                        <Typography sx={{ color: 'grey' }}>
                                            <FormattedMessage id="dashboardAdmin.services.details.descriptionEn" />
                                        </Typography>
                                        <div dangerouslySetInnerHTML={{ __html: descriptionEn }} />
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

DialogViewService.propTypes = {
    openDialogView: PropTypes.bool,
    handleToggleDialogView: PropTypes.func,
    currentService: PropTypes.object,
};
export default DialogViewService;
