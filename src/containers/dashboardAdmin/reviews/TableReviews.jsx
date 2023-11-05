import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Box, IconButton, Typography } from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';

import { colorTokens } from 'config/theme';
import HeaderComponent from 'components/dashboard/HeaderComponent';
import LoadingOverlay from 'components/common/LoadingOverlay';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { deleteReviewService, getAllReviewsService } from 'services/reviewsService';

import DialogViewReview from './DialogViewReview';
import DialogConfirmDelete from 'components/dashboard/DialogConfirmDelete';
import { LANGUAGES } from 'utils';

const TableAllReviews = () => {
    const axiosPrivate = useAxiosPrivate();

    const language = useSelector(state => state.app.language || '');

    const [allReviews, setAllReviews] = useState([]);
    const [idReview, setIdReview] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);

    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [openDialogView, setOpenDialogView] = useState(false);

    useEffect(() => {
        getAllReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllReviews = async () => {
        try {
            setIsLoading(true);
            const response = await getAllReviewsService(axiosPrivate);
            if (response?.data) {
                setAllReviews(response.data);
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
        setIdReview(id);
        setOpenDialogDelete(!openDialogDelete);
    };

    const handleToggleDialogView = review => {
        setCurrentReview(review);
        setOpenDialogView(!openDialogView);
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            setOpenDialogDelete(!openDialogDelete);
            const response = await deleteReviewService(axiosPrivate, idReview);
            if (response?.data?.message) {
                setIsLoading(false);
                toast.success(response.data.message);
                setIdReview(null);
                getAllReviews();
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
            field: 'roomTypeKey',
            headerName: 'Room type',
            headerAlign: 'center',
            align: 'center',
            minWidth: 300,
            renderCell: ({ row }) => {
                return (
                    <Typography>
                        {LANGUAGES.VI === language
                            ? row.roomTypesDataReviews.roomTypeDataRoomTypes.valueVi
                            : row.roomTypesDataReviews.roomTypeDataRoomTypes.valueEn}
                    </Typography>
                );
            },
        },
        {
            field: 'email',
            headerName: 'User email',
            minWidth: 500,

            renderCell: ({ row }) => {
                return <Typography>{row.userDataReviews.email}</Typography>;
            },
        },
        {
            field: 'createdAt',
            headerName: 'Created time',
            headerAlign: 'center',
            align: 'center',
            minWidth: 200,

            renderCell: ({ row }) => {
                return <Typography>{dayjs(row.createdAt).format('DD/MM/YYYY')}</Typography>;
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
                        title={<FormattedMessage id="dashboardAdmin.reviews.title" />}
                        subtitle={<FormattedMessage id="dashboardAdmin.reviews.subtitle" />}
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
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: 'none',
                            backgroundColor: colorTokens.primary[600],
                        },
                        '& .MuiCheckbox-root': {
                            color: `${colorTokens.primary[800]} !important`,
                        },
                    }}
                >
                    <DataGrid rows={allReviews} columns={columns} />
                </Box>
            </Box>
            <DialogConfirmDelete
                handleToggleDialogDelete={handleToggleDialogDelete}
                openDialogDelete={openDialogDelete}
                handleDelete={handleDelete}
            />

            <DialogViewReview
                handleToggleDialogView={handleToggleDialogView}
                openDialogView={openDialogView}
                currentReview={currentReview}
                getAllReviews={getAllReviews}
                setIsLoading={setIsLoading}
            />
        </>
    );
};
export default TableAllReviews;
