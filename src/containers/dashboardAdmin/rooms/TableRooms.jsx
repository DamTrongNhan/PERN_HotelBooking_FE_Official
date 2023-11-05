import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Box, IconButton, FormControl, Select, MenuItem, Button, useTheme, Typography } from '@mui/material';
import { Lock, LockOpen, Edit, Delete, AddBox, CleaningServices } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import { colorTokens } from 'config/theme';
import HeaderComponent from 'components/dashboard/HeaderComponent';
import LoadingOverlay from 'components/common/LoadingOverlay';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { getAllRoomsService, deleteRoomService, updateRoomStatusService } from 'services/roomsService';
import { getAllCodesByTypeService } from 'services/allCodesService';

import DialogConfirmDelete from 'components/dashboard/DialogConfirmDelete';
import DialogCreateRoom from './DialogCreateRoom';
import DialogUpdateRoom from './DialogUpdateRoom';

import { LANGUAGES } from 'utils';

const TableRooms = () => {
    const axiosPrivate = useAxiosPrivate();
    const language = useSelector(state => state.app.language || 'vi');

    const theme = useTheme();

    const [allRooms, setAllRooms] = useState([]);
    const [idRoom, setIdRoom] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);

    const [allRoomStatus, setAllRoomStatus] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [openDialogCreate, setOpenDialogCreate] = useState(false);
    const [openDialogUpdate, setOpenDialogUpdate] = useState(false);

    const statusMap = {
        SR1: <LockOpen color="success" />,
        SR2: <Lock color="error" />,
        SR3: <CleaningServices color="info" />,
    };

    useEffect(() => {
        getAllRooms();
        getAllRoomStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllRooms = async () => {
        try {
            setIsLoading(true);
            const response = await getAllRoomsService();
            if (response?.data) {
                setAllRooms(response.data);
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

    const getAllRoomStatus = async () => {
        try {
            setIsLoading(true);
            const response = await getAllCodesByTypeService('RoomStatus');
            if (response?.data) {
                setIsLoading(false);
                setAllRoomStatus(response.data);
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

    const handleToggleDialogDelete = id => {
        setIdRoom(id);
        setOpenDialogDelete(!openDialogDelete);
    };
    const handleToggleDialogCreate = () => {
        setOpenDialogCreate(!openDialogCreate);
    };
    const handleToggleDialogUpdate = room => {
        setCurrentRoom(room);
        setOpenDialogUpdate(!openDialogUpdate);
    };

    const handleChangeRoomStatus = async (event, id) => {
        const roomStatusKey = event.target.value;
        try {
            setIsLoading(true);
            const response = await updateRoomStatusService(axiosPrivate, id, { roomStatusKey });
            if (response?.data?.message) {
                setIsLoading(false);
                toast.success(response.data.message);
                getAllRooms();
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

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            setOpenDialogDelete(!openDialogDelete);
            const response = await deleteRoomService(axiosPrivate, idRoom);
            if (response?.data?.message) {
                setIsLoading(false);
                toast.success(response.data.message);
                setIdRoom(null);
                getAllRooms();
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
        }
    };

    const columns = [
        {
            field: 'number',
            headerName: 'Room',
            headerAlign: 'center',
            align: 'center',
            minWidth: 50,
            // cellClassName: 'name-column--cell'
        },
        {
            field: 'roomTypeKey',
            headerName: 'Room type',
            headerAlign: 'center',
            align: 'center',
            minWidth: 300,

            renderCell: ({ row }) => {
                return (
                    <Typography>
                        {language === LANGUAGES.VI ? row?.roomTypeDataRooms.valueVi : row?.roomTypeDataRooms.valueEn}
                    </Typography>
                );
            },
        },
        {
            field: 'numberBookings',
            headerName: 'Number of bookings',
            headerAlign: 'center',
            align: 'center',
            minWidth: 200,
        },
        {
            field: 'updateStatus',
            headerName: 'Room status',
            headerAlign: 'center',
            align: 'center',
            minWidth: 400,

            renderCell: ({ row: { roomStatusKey, id } }) => {
                return (
                    <FormControl sx={{ width: '80%' }} variant="standard">
                        <Select value={roomStatusKey} onChange={event => handleChangeRoomStatus(event, id)}>
                            {allRoomStatus &&
                                allRoomStatus.map((roomStatus, index) => {
                                    return (
                                        <MenuItem key={index} value={roomStatus.keyMap}>
                                            <Button
                                                fullWidth
                                                sx={{ textTransform: 'none' }}
                                                endIcon={statusMap[roomStatus.keyMap] || ''}
                                            >
                                                <Typography
                                                    sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}
                                                >
                                                    {language === LANGUAGES.VI
                                                        ? roomStatus.valueVi
                                                        : roomStatus.valueEn}
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
            minWidth: 100,

            renderCell: ({ row }) => {
                return (
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                        <IconButton onClick={() => handleToggleDialogUpdate(row)} aria-label="update" size="small">
                            <Edit fontSize="inherit" />
                        </IconButton>
                        <IconButton onClick={() => handleToggleDialogDelete(row.id)} aria-label="delete" size="small">
                            <Delete fontSize="inherit" />
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
                        title={<FormattedMessage id="dashboardAdmin.rooms.title" />}
                        subtitle={<FormattedMessage id="dashboardAdmin.rooms.subtitle" />}
                    />
                    <IconButton color="info" onClick={() => handleToggleDialogCreate()} aria-label="add" size="large">
                        <AddBox fontSize="inherit" />
                    </IconButton>
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
                    <DataGrid rows={allRooms} columns={columns} slots={{ toolbar: GridToolbar }} />
                </Box>
            </Box>
            <DialogConfirmDelete
                handleToggleDialogDelete={handleToggleDialogDelete}
                openDialogDelete={openDialogDelete}
                handleDelete={handleDelete}
            />
            <DialogCreateRoom
                handleToggleDialogCreate={handleToggleDialogCreate}
                openDialogCreate={openDialogCreate}
                getAllRooms={getAllRooms}
                setIsLoading={setIsLoading}
            />
            <DialogUpdateRoom
                handleToggleDialogUpdate={handleToggleDialogUpdate}
                openDialogUpdate={openDialogUpdate}
                currentRoom={currentRoom}
                getAllRooms={getAllRooms}
                setIsLoading={setIsLoading}
            />
        </>
    );
};

export default TableRooms;
