import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Box, IconButton, FormControl, Select, MenuItem, Button, useTheme, Typography } from '@mui/material';
import { Help, MarkEmailRead, EventAvailable, ExitToApp, Cancel, CheckCircle, Visibility } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';

import { colorTokens } from 'config/theme';
import HeaderComponent from 'components/dashboard/HeaderComponent';
import LoadingOverlay from 'components/common/LoadingOverlay';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { getAllBookingHistoriesService, updateBookingStatusService } from 'services/bookingsService';
import { getAllCodesByTypeService } from 'services/allCodesService';

import DialogViewBooking from 'containers/dashboardAdmin/bookings/DialogViewBooking';

import { LANGUAGES } from 'utils';

const TableBookingHistories = () => {
    const axiosPrivate = useAxiosPrivate();
    const language = useSelector(state => state.app.language || 'vi');

    const theme = useTheme();

    const [allBookings, setAllBookings] = useState([]);
    const [allBookingStatus, setAllBookingStatus] = useState([]);

    const [currentBooking, setCurrentBooking] = useState(null);

    const [openDialogViewBooking, setOpenDialogViewBooking] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const statusMap = {
        SB0: <Help color="warning" />,
        SB1: <MarkEmailRead color="info" />,
        SB2: <EventAvailable color="primary" />,
        SB3: <ExitToApp color="secondary" />,
        SB4: <CheckCircle color="success" />,
        SB5: <Cancel color="error" />,
    };

    useEffect(() => {
        getAllBookings();
        getAllBookingStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllBookings = async () => {
        try {
            setIsLoading(true);
            const response = await getAllBookingHistoriesService(axiosPrivate);
            if (response?.data?.data) {
                setAllBookings(response.data.data);

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

    const getAllBookingStatus = async () => {
        try {
            setIsLoading(true);
            const response = await getAllCodesByTypeService('BookingStatus');
            if (response?.data) {
                setIsLoading(false);
                setAllBookingStatus(response.data);
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

    const handleToggleDialogViewBooking = booking => {
        setCurrentBooking(booking);
        setOpenDialogViewBooking(!openDialogViewBooking);
    };
    const handleChangeBookingStatus = async (event, id, roomId, email) => {
        const bookingStatusKey = event.target.value;
        try {
            setIsLoading(true);
            const response = await updateBookingStatusService(axiosPrivate, id, {
                bookingStatusKey,
                roomId,
                email,
                language,
            });
            if (response?.data?.message) {
                setIsLoading(false);
                toast.success(response.data.message);
                getAllBookings();
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

    const columns = [
        {
            field: 'roomNumber',
            headerName: 'Room',
            headerAlign: 'left',
            align: 'left',
            minWidth: 50,
            renderCell: ({ row }) => {
                return (
                    <>
                        <Typography>{row.roomDataBookings.number}</Typography>
                    </>
                );
            },
        },
        {
            field: 'email',
            headerName: 'User email',
            headerAlign: 'left',
            align: 'left',
            minWidth: 300,
        },
        {
            field: 'checkIn',
            headerName: 'Check in',
            headerAlign: 'center',
            align: 'center',
            minWidth: 150,
            renderCell: ({ row }) => {
                return (
                    <>
                        <Typography>{dayjs(row.checkIn).format('DD/MM/YYYY')}</Typography>
                    </>
                );
            },
        },
        {
            field: 'CheckOut',
            headerName: 'Check out',
            headerAlign: 'center',
            align: 'center',
            minWidth: 150,
            renderCell: ({ row }) => {
                return (
                    <>
                        <Typography>{dayjs(row.checkOut).format('DD/MM/YYYY')}</Typography>
                    </>
                );
            },
        },
        {
            field: 'updateStatus',
            headerName: 'Booking status',
            headerAlign: 'center',
            align: 'center',
            minWidth: 350,
            renderCell: ({ row: { bookingStatusKey, id, roomId, email } }) => {
                return (
                    <FormControl sx={{ width: '80%' }} variant="standard">
                        <Select
                            value={bookingStatusKey}
                            onChange={event => handleChangeBookingStatus(event, id, roomId, email)}
                        >
                            {allBookingStatus &&
                                allBookingStatus.map((bookingStatus, index) => {
                                    return (
                                        <MenuItem key={index} value={bookingStatus.keyMap}>
                                            <Button
                                                fullWidth
                                                sx={{ textTransform: 'none' }}
                                                endIcon={statusMap[bookingStatus.keyMap] || ''}
                                            >
                                                <Typography
                                                    sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}
                                                >
                                                    {language === LANGUAGES.VI
                                                        ? bookingStatus.valueVi
                                                        : bookingStatus.valueEn}
                                                </Typography>
                                            </Button>
                                        </MenuItem>
                                    );
                                })}
                        </Select>
                    </FormControl>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            headerAlign: 'center',
            align: 'center',
            minWidth: 200,
            renderCell: ({ row }) => {
                return (
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                        <IconButton onClick={() => handleToggleDialogViewBooking(row)} aria-label="view" size="small">
                            <Visibility fontSize="inherit" />
                        </IconButton>
                    </Box>
                );
            },
        },
    ];

    return (
        <>
            <LoadingOverlay isLoading={isLoading} />
            <Box m="20px">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <HeaderComponent
                        title={<FormattedMessage id="dashboardAdmin.bookings.title" />}
                        subtitle={<FormattedMessage id="dashboardAdmin.bookings.subtitle" />}
                    />
                </Box>
                <Box
                    height="72vh"
                    sx={{
                        '& .MuiDataGrid-root': {
                            border: 'none',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: 'none',
                        },
                        // '& .name-column--cell': {
                        //     color: colorTokens.primary[50]
                        // },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: colorTokens.primary[600],
                            borderBottom: 'none',
                        },
                        // '& .MuiDataGrid-virtualScroller': {
                        //     backgroundColor: colorTokens.primary[400]
                        // },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: 'none',
                            backgroundColor: colorTokens.primary[600],
                        },
                        '& .MuiCheckbox-root': {
                            color: `${colorTokens.primary[800]} !important`,
                        },
                        '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
                            color: `${colorTokens.grey[500]} !important`,
                        },
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none',
                            boxShadow: 'none',
                            border: 'none',
                        },
                    }}
                >
                    <DataGrid
                        rows={allBookings}
                        columns={columns}
                        slots={{ toolbar: GridToolbar }}
                        sx={{ overflowX: 'scroll' }}
                    />
                </Box>
            </Box>
            <DialogViewBooking
                handleToggleDialogView={handleToggleDialogViewBooking}
                openDialogView={openDialogViewBooking}
                currentBooking={currentBooking}
            />
        </>
    );
};

export default TableBookingHistories;
