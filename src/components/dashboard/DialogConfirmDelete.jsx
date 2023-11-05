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
    const { handleDelete, handleToggleDialogDelete, openDialogDelete } = props;

    return (
        <>
            {openDialogDelete && (
                <Dialog
                    fullWidth
                    maxWidth="lg"
                    PaperProps={{
                        style: {
                            width: '70%',
                        },
                    }}
                    open={openDialogDelete}
                    onClose={handleToggleDialogDelete}
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
                                        <FormattedMessage id="dashboardCommon.confirmHeader" />
                                    </Typography>
                                    <Typography id="dialog-confirm-delete-body" variant="body2">
                                        <FormattedMessage id="dashboardCommon.confirmBody" />
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider />
                            <DialogActions>
                                <Button onClick={() => handleToggleDialogDelete()} variant="contained" color="text">
                                    <FormattedMessage id="dashboardCommon.cancel" />
                                </Button>
                                <Button onClick={() => handleDelete()} variant="contained" color="error">
                                    <FormattedMessage id="dashboardCommon.delete" />
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
    openDialogDelete: PropTypes.bool,
    handleToggleDialogDelete: PropTypes.func,
    handleDelete: PropTypes.func,
};
export default DialogConfirmDelete;
