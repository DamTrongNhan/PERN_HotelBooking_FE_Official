import { Unstable_Grid2 as Grid, Typography, TextField } from '@mui/material';

import { FormattedMessage } from 'react-intl';

const CustomerDataForm = props => {
    return (
        <>
            <Typography variant="h6" gutterBottom>
                <FormattedMessage id="guest.booking.enterInformation.title" />
            </Typography>

            <Grid container spacing={3}>
                <Grid xs={12} lg={6}>
                    <TextField
                        fullWidth
                        error={!!(props.formik.touched.firstName && !!props.formik.errors.firstName)}
                        helperText={props.formik.touched.firstName && props.formik.errors.firstName}
                        variant="standard"
                        label="First Name"
                        name="firstName"
                        onBlur={props.formik.handleBlur}
                        onChange={props.formik.handleChange}
                        type="text"
                        value={props.formik.values.firstName}
                    />
                </Grid>
                <Grid xs={12} lg={6}>
                    <TextField
                        error={!!(props.formik.touched.lastName && !!props.formik.errors.lastName)}
                        fullWidth
                        helperText={props.formik.touched.lastName && props.formik.errors.lastName}
                        variant="standard"
                        label="Last Name"
                        name="lastName"
                        onBlur={props.formik.handleBlur}
                        onChange={props.formik.handleChange}
                        type="text"
                        value={props.formik.values.lastName}
                    />
                </Grid>
                <Grid xs={12} lg={12}>
                    <TextField
                        fullWidth
                        error={!!(props.formik.touched.email && !!props.formik.errors.email)}
                        helperText={props.formik.touched.email && props.formik.errors.email}
                        variant="standard"
                        label="Email"
                        name="email"
                        onBlur={props.formik.handleBlur}
                        onChange={props.formik.handleChange}
                        type="text"
                        value={props.formik.values.email}
                    />
                </Grid>
                <Grid xs={12} lg={6}>
                    <TextField
                        error={!!(props.formik.touched.phone && !!props.formik.errors.phone)}
                        fullWidth
                        helperText={props.formik.touched.phone && props.formik.errors.phone}
                        variant="standard"
                        label="Phone"
                        name="phone"
                        onBlur={props.formik.handleBlur}
                        onChange={props.formik.handleChange}
                        type="text"
                        value={props.formik.values.phone}
                    />
                </Grid>
                <Grid xs={12} lg={6}>
                    <TextField
                        error={!!(props.formik.touched.country && !!props.formik.errors.country)}
                        fullWidth
                        helperText={props.formik.touched.country && props.formik.errors.country}
                        variant="standard"
                        label="Country"
                        name="country"
                        onBlur={props.formik.handleBlur}
                        onChange={props.formik.handleChange}
                        type="text"
                        value={props.formik.values.country}
                    />
                </Grid>
                <Grid xs={12} lg={12}>
                    <TextField
                        error={!!(props.formik.touched.CIC && !!props.formik.errors.CIC)}
                        fullWidth
                        helperText={props.formik.touched.CIC && props.formik.errors.CIC}
                        variant="standard"
                        label="Citizen ID"
                        name="CIC"
                        onBlur={props.formik.handleBlur}
                        onChange={props.formik.handleChange}
                        type="text"
                        value={props.formik.values.CIC}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default CustomerDataForm;
