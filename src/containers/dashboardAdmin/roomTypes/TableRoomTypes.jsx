import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Box, IconButton, Typography } from '@mui/material';
import { Edit, Visibility, Delete, AddBox } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import { colorTokens } from 'config/theme';
import HeaderComponent from 'components/dashboard/HeaderComponent';
import LoadingOverlay from 'components/common/LoadingOverlay';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { getAllRoomTypesService, deleteRoomTypeService } from 'services/roomTypesService';

import DialogConfirmDelete from 'components/dashboard/DialogConfirmDelete';
import DialogCreateRoomType from './DialogCreateRoomType';
import DialogUpdateRoomType from './DialogUpdateRoomType';
import DialogViewRoomType from './DialogViewRoomType';

import { LANGUAGES, formatCurrencyVND, formatCurrencyUSD } from 'utils';

const TableRoomTypes = () => {
    const axiosPrivate = useAxiosPrivate();

    const language = useSelector(state => state.app.language);

    const [allRoomTypes, setAllRoomTypes] = useState([]);
    const [idRoomType, setIdRoomType] = useState(null);
    const [currentRoomType, setCurrentRoomType] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [openDialogCreate, setOpenDialogCreate] = useState(false);
    const [openDialogUpdate, setOpenDialogUpdate] = useState(false);
    const [openDialogView, setOpenDialogView] = useState(false);

    useEffect(() => {
        getAllRoomTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllRoomTypes = async () => {
        try {
            setIsLoading(true);
            const response = await getAllRoomTypesService();
            if (response?.data) {
                setAllRoomTypes(response.data);
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

    const handleToggleDialogDelete = id => {
        setIdRoomType(id);
        setOpenDialogDelete(!openDialogDelete);
    };
    const handleToggleDialogCreate = () => {
        setOpenDialogCreate(!openDialogCreate);
    };
    const handleToggleDialogUpdate = roomType => {
        setCurrentRoomType(roomType);
        setOpenDialogUpdate(!openDialogUpdate);
    };

    const handleToggleDialogView = roomType => {
        setCurrentRoomType(roomType);
        setOpenDialogView(!openDialogView);
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            setOpenDialogDelete(!openDialogDelete);
            const response = await deleteRoomTypeService(axiosPrivate, idRoomType);
            if (response?.data?.message) {
                setIsLoading(false);
                toast.success(response.data.message);
                setIdRoomType(null);
                getAllRoomTypes();
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
            field: 'roomTypeKey',
            headerName: 'Room type',
            headerAlign: 'center',
            align: 'center',
            minWidth: 300,
            renderCell: ({ row }) => {
                return (
                    <Typography>
                        {language === LANGUAGES.VI
                            ? row?.roomTypeDataRoomTypes.valueVi
                            : row?.roomTypeDataRoomTypes.valueEn}
                    </Typography>
                );
            },
        },
        {
            field: 'bedTypeKey',
            headerName: 'Bed type key ',
            headerAlign: 'center',
            align: 'center',
            minWidth: 300,

            renderCell: ({ row }) => {
                return (
                    <Typography>
                        {language === LANGUAGES.VI ? row?.bedTypeData.valueVi : row?.bedTypeData.valueEn}
                    </Typography>
                );
            },
        },
        {
            field: 'size',
            headerName: 'Size',
            headerAlign: 'center',
            align: 'center',
            minWidth: 100,

            renderCell: ({ row }) => {
                return <Typography>{row?.size}m2</Typography>;
            },
        },
        {
            field: 'pricePerNight',
            headerName: 'Price per night',
            headerAlign: 'center',
            align: 'center',
            minWidth: 300,

            renderCell: ({ row }) => {
                return (
                    <Typography>
                        {language === LANGUAGES.VI
                            ? formatCurrencyVND(row?.pricePerNight)
                            : formatCurrencyUSD(row?.pricePerNight)}
                    </Typography>
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
                        <IconButton onClick={() => handleToggleDialogView(row)} aria-label="view" size="small">
                            <Visibility fontSize="inherit" />
                        </IconButton>
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
                        title={<FormattedMessage id="dashboardAdmin.roomTypes.title" />}
                        subtitle={<FormattedMessage id="dashboardAdmin.roomTypes.subtitle" />}
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
                    }}
                >
                    <DataGrid rows={allRoomTypes} columns={columns} slots={{ toolbar: GridToolbar }} />
                </Box>
            </Box>
            <DialogViewRoomType
                handleToggleDialogView={handleToggleDialogView}
                openDialogView={openDialogView}
                currentRoomType={currentRoomType}
            />
            <DialogConfirmDelete
                handleToggleDialogDelete={handleToggleDialogDelete}
                openDialogDelete={openDialogDelete}
                handleDelete={handleDelete}
            />
            <DialogCreateRoomType
                handleToggleDialogCreate={handleToggleDialogCreate}
                openDialogCreate={openDialogCreate}
                getAllRoomTypes={getAllRoomTypes}
                setIsLoading={setIsLoading}
            />
            <DialogUpdateRoomType
                handleToggleDialogUpdate={handleToggleDialogUpdate}
                openDialogUpdate={openDialogUpdate}
                currentRoomType={currentRoomType}
                getAllRoomTypes={getAllRoomTypes}
                setIsLoading={setIsLoading}
            />
        </>
    );
};

export default TableRoomTypes;
