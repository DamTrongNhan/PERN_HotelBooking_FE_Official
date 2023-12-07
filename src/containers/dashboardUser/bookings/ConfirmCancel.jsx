import PropTypes from 'prop-types';

import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    Stack,
    Button,
    Divider,
} from '@mui/material';
import { ErrorOutlined } from '@mui/icons-material';

import { FormattedMessage } from 'react-intl';

const DialogConfirmDelete = props => {
    const { handleCancelBooking, handleToggleDialogConfirmCancel, openDialogConfirmCancel } = props;

    return (
        <>
            {openDialogConfirmCancel && (
                <Dialog
                    fullWidth
                    maxWidth="lg"
                    PaperProps={{
                        style: {
                            width: '70%',
                        },
                    }}
                    open={openDialogConfirmCancel}
                    onClose={handleToggleDialogConfirmCancel}
                    aria-labelledby="confirm-dialog-delete"
                >
                    <DialogContent>
                        <Stack spacing={1}>
                            <Box
                                p={1}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                <IconButton color="warning" size="large">
                                    <ErrorOutlined fontSize="large" />
                                </IconButton>
                                <Box>
                                    <Typography id="dialog-confirm-delete" variant="h3" mb={1}>
                                        <FormattedMessage id="dashboardUser.bookings.confirmCancelTitle" />
                                    </Typography>
                                    <Typography id="dialog-confirm-delete-body" variant="body2">
                                        <FormattedMessage id="dashboardUser.bookings.confirmCancelBody" />
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider />
                            <DialogActions>
                                <Button
                                    onClick={() => handleToggleDialogConfirmCancel()}
                                    variant="contained"
                                    color="text"
                                >
                                    <FormattedMessage id="dashboardUser.bookings.cancel" />
                                </Button>
                                <Button onClick={() => handleCancelBooking()} variant="contained" color="error">
                                    <FormattedMessage id="dashboardUser.bookings.yes" />
                                </Button>
                            </DialogActions>
                        </Stack>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};
DialogConfirmDelete.propTypes = {
    openDialogConfirmCancel: PropTypes.bool,
    handleToggleDialogConfirmCancel: PropTypes.func,
    handleCancelBooking: PropTypes.func,
};
export default DialogConfirmDelete;
