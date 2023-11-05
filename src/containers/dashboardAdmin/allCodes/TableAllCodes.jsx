import { useEffect, useState } from 'react';

import { Box, IconButton } from '@mui/material';
import { Edit, Delete, AddBox } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import { colorTokens } from 'config/theme';
import HeaderComponent from 'components/dashboard/HeaderComponent';
import LoadingOverlay from 'components/common/LoadingOverlay';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { deleteCodeService, getAllCodesService } from 'services/allCodesService';

import DialogCreateCode from './DialogCreateCode';
import DialogUpdateCode from './DialogUpdateCode';
import DialogConfirmDelete from 'components/dashboard/DialogConfirmDelete';

const TableAllCodes = () => {
    const axiosPrivate = useAxiosPrivate();
    const [allCodes, setAllCodes] = useState([]);
    const [idCode, setIdCode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCode, setCurrentCode] = useState(null);

    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [openDialogCreate, setOpenDialogCreate] = useState(false);
    const [openDialogUpdate, setOpenDialogUpdate] = useState(false);

    useEffect(() => {
        getAllCodes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllCodes = async () => {
        try {
            setIsLoading(true);
            const response = await getAllCodesService(axiosPrivate);
            if (response?.data?.data) {
                setAllCodes(response.data.data);
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
        }
    };

    const handleToggleDialogDelete = id => {
        setIdCode(id);
        setOpenDialogDelete(!openDialogDelete);
    };
    const handleToggleDialogCreate = () => {
        setOpenDialogCreate(!openDialogCreate);
    };
    const handleToggleDialogUpdate = code => {
        setCurrentCode(code);
        setOpenDialogUpdate(!openDialogUpdate);
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            setOpenDialogDelete(!openDialogDelete);
            const response = await deleteCodeService(axiosPrivate, idCode);
            if (response?.data?.message) {
                setIsLoading(false);
                toast.success(response.data.message);
                setIdCode(null);
                getAllCodes();
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
            field: 'keyMap',
            headerName: 'Key Map',
            headerAlign: 'center',
            align: 'center',
            minWidth: 50,
            // cellClassName: 'name-column--cell'
        },
        {
            field: 'type',
            headerName: 'Type',
            minWidth: 200,
        },
        {
            field: 'valueVi',
            headerName: 'Value Vi',
            minWidth: 390,
        },
        {
            field: 'valueEn',
            headerName: 'Value En',
            minWidth: 390,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            headerAlign: 'left',
            align: 'left',
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
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <HeaderComponent
                        title={<FormattedMessage id="dashboardAdmin.allCodes.title" />}
                        subtitle={<FormattedMessage id="dashboardAdmin.allCodes.subtitle" />}
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
                    <DataGrid rows={allCodes} columns={columns} />
                </Box>
            </Box>
            <DialogConfirmDelete
                handleToggleDialogDelete={handleToggleDialogDelete}
                openDialogDelete={openDialogDelete}
                handleDelete={handleDelete}
            />
            <DialogCreateCode
                handleToggleDialogCreate={handleToggleDialogCreate}
                openDialogCreate={openDialogCreate}
                getAllCodes={getAllCodes}
                setIsLoading={setIsLoading}
            />
            <DialogUpdateCode
                handleToggleDialogUpdate={handleToggleDialogUpdate}
                openDialogUpdate={openDialogUpdate}
                currentCode={currentCode}
                getAllCodes={getAllCodes}
                setIsLoading={setIsLoading}
            />
        </>
    );
};
export default TableAllCodes;
