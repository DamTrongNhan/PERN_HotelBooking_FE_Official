import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Box, IconButton, Typography } from '@mui/material';
import { Edit, Delete, AddBox, Visibility } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import { colorTokens } from 'config/theme';
import HeaderComponent from 'components/dashboard/HeaderComponent';
import LoadingOverlay from 'components/common/LoadingOverlay';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { deleteService_Service, getAllServices_Service } from 'services/services_Service';

import DialogCreateService from './DialogCreateService';
import DialogUpdateService from './DialogUpdateService';
import DialogViewService from './DialogViewService';
import DialogConfirmDelete from 'components/dashboard/DialogConfirmDelete';

import { LANGUAGES, formatCurrencyVND, formatCurrencyUSD } from 'utils';

const TableAllServices = () => {
    const axiosPrivate = useAxiosPrivate();

    const language = useSelector(state => state.app.language);

    const [allServices, setAllServices] = useState([]);
    const [idService, setIdService] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [currentService, setCurrentService] = useState(null);

    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [openDialogCreate, setOpenDialogCreate] = useState(false);
    const [openDialogUpdate, setOpenDialogUpdate] = useState(false);
    const [openDialogView, setOpenDialogView] = useState(false);

    useEffect(() => {
        getAllServices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllServices = async () => {
        try {
            setIsLoading(true);
            const response = await getAllServices_Service();
            if (response?.data) {
                setAllServices(response.data);
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

    const handleToggleDialogDelete = id => {
        setIdService(id);
        setOpenDialogDelete(!openDialogDelete);
    };
    const handleToggleDialogCreate = () => {
        setOpenDialogCreate(!openDialogCreate);
    };
    const handleToggleDialogUpdate = service => {
        setCurrentService(service);
        setOpenDialogUpdate(!openDialogUpdate);
    };
    const handleToggleDialogView = service => {
        setCurrentService(service);
        setOpenDialogView(!openDialogView);
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            setOpenDialogDelete(!openDialogDelete);
            const response = await deleteService_Service(axiosPrivate, idService);
            if (response?.data?.message) {
                setIsLoading(false);
                toast.success(response.data.message);
                setIdService(null);
                getAllServices();
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
            field: 'keyMap',
            headerName: 'Key Map',
            headerAlign: 'center',
            align: 'center',
            minWidth: 50,
            // cellClassName: 'name-column--cell'
        },
        {
            field: 'titleVi',
            headerName: 'Title Vi',
            minWidth: 300,
        },
        {
            field: 'titleEn',
            headerName: 'Title En',
            minWidth: 300,
        },
        {
            field: 'price',
            headerName: 'Price',
            headerAlign: 'center',
            align: 'center',
            minWidth: 300,
            renderCell: ({ row }) => {
                return (
                    <Typography>
                        {language === LANGUAGES.VI ? formatCurrencyVND(row?.price) : formatCurrencyUSD(row?.price)}
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
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <HeaderComponent
                        title={<FormattedMessage id="dashboardAdmin.services.title" />}
                        subtitle={<FormattedMessage id="dashboardAdmin.services.subtitle" />}
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
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: 'none',
                            backgroundColor: colorTokens.primary[600],
                        },
                        '& .MuiCheckbox-root': {
                            color: `${colorTokens.primary[800]} !important`,
                        },
                    }}
                >
                    <DataGrid rows={allServices} columns={columns} />
                </Box>
            </Box>
            <DialogConfirmDelete
                handleToggleDialogDelete={handleToggleDialogDelete}
                openDialogDelete={openDialogDelete}
                handleDelete={handleDelete}
            />
            <DialogCreateService
                handleToggleDialogCreate={handleToggleDialogCreate}
                openDialogCreate={openDialogCreate}
                getAllServices={getAllServices}
                setIsLoading={setIsLoading}
            />
            <DialogUpdateService
                handleToggleDialogUpdate={handleToggleDialogUpdate}
                openDialogUpdate={openDialogUpdate}
                currentService={currentService}
                getAllServices={getAllServices}
                setIsLoading={setIsLoading}
            />
            <DialogViewService
                handleToggleDialogView={handleToggleDialogView}
                openDialogView={openDialogView}
                currentService={currentService}
            />
        </>
    );
};
export default TableAllServices;
