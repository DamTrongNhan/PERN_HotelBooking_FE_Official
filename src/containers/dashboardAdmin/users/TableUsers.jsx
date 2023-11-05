import { useEffect, useState } from 'react';

import { Box, IconButton, Switch } from '@mui/material';
import { Lock, LockOpen, Edit, Visibility, Delete, PersonAdd } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import { colorTokens } from 'config/theme';
import HeaderComponent from 'components/dashboard/HeaderComponent';
import LoadingOverlay from 'components/common/LoadingOverlay';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { getAllUsersService, deleteUserService, updateUserStatusService } from 'services/usersService';

import DialogCreateUser from './DialogCreateUser';
import DialogUpdateUser from './DialogUpdateUser';
import DialogViewUser from './DialogViewUser';
import DialogConfirmDelete from 'components/dashboard/DialogConfirmDelete';

const TableUsers = () => {
    const axiosPrivate = useAxiosPrivate();

    const [allUsers, setAllUsers] = useState([]);
    const [idUser, setIdUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [openDialogCreate, setOpenDialogCreate] = useState(false);
    const [openDialogUpdate, setOpenDialogUpdate] = useState(false);
    const [openDialogView, setOpenDialogView] = useState(false);

    useEffect(() => {
        getAllUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllUsers = async () => {
        try {
            setIsLoading(true);
            const response = await getAllUsersService(axiosPrivate);
            if (response?.data?.data) {
                setAllUsers(response.data.data);
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
        setIdUser(id);
        setOpenDialogDelete(!openDialogDelete);
    };
    const handleToggleDialogCreate = () => {
        setOpenDialogCreate(!openDialogCreate);
    };
    const handleToggleDialogUpdate = user => {
        setCurrentUser(user);
        setOpenDialogUpdate(!openDialogUpdate);
    };

    const handleToggleDialogView = user => {
        setCurrentUser(user);
        setOpenDialogView(!openDialogView);
    };

    const handleUpdateUserStatus = async (event, id) => {
        const userStatusKey = event.target.checked ? 'SU1' : 'SU2';
        try {
            setIsLoading(true);
            const response = await updateUserStatusService(axiosPrivate, id, { userStatusKey });
            if (response?.data?.message) {
                setIsLoading(false);
                toast.success(response.data.message);
                getAllUsers();
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
            const response = await deleteUserService(axiosPrivate, idUser);
            if (response?.data?.message) {
                setIsLoading(false);
                toast.success(response.data.message);
                setIdUser(null);
                getAllUsers();
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
            field: 'firstName',
            headerName: 'First Name',
            minWidth: 200,
            // cellClassName: 'name-column--cell'
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 400,
        },
        {
            field: 'phone',
            headerName: 'Phone Number',
            minWidth: 200,
        },
        {
            field: 'userStatusKey',
            headerName: 'Status',
            headerAlign: 'center',
            align: 'center',
            minWidth: 200,
            renderCell: ({ row: { userStatusKey, id } }) => {
                return (
                    <>
                        <Switch
                            checked={userStatusKey === 'SU1'}
                            onChange={event => handleUpdateUserStatus(event, id)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />

                        <IconButton color={userStatusKey === 'SU1' ? 'success' : 'error'}>
                            {userStatusKey === 'SU1' ? <LockOpen /> : <Lock />}
                        </IconButton>
                    </>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 200,
            headerAlign: 'center',
            align: 'center',
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
                        title={<FormattedMessage id="dashboardAdmin.users.title" />}
                        subtitle={<FormattedMessage id="dashboardAdmin.users.subtitle" />}
                    />
                    <IconButton color="info" onClick={() => handleToggleDialogCreate()} aria-label="add" size="large">
                        <PersonAdd fontSize="inherit" />
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
                    <DataGrid rows={allUsers} columns={columns} slots={{ toolbar: GridToolbar }} />
                </Box>
            </Box>
            <DialogViewUser
                handleToggleDialogView={handleToggleDialogView}
                openDialogView={openDialogView}
                currentUser={currentUser}
            />
            <DialogConfirmDelete
                handleToggleDialogDelete={handleToggleDialogDelete}
                openDialogDelete={openDialogDelete}
                handleDelete={handleDelete}
            />
            <DialogCreateUser
                handleToggleDialogCreate={handleToggleDialogCreate}
                openDialogCreate={openDialogCreate}
                getAllUsers={getAllUsers}
                setIsLoading={setIsLoading}
            />
            <DialogUpdateUser
                handleToggleDialogUpdate={handleToggleDialogUpdate}
                openDialogUpdate={openDialogUpdate}
                currentUser={currentUser}
                getAllUsers={getAllUsers}
                setIsLoading={setIsLoading}
            />
        </>
    );
};

export default TableUsers;
