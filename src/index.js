import React from 'react';
import ReactDOM from 'react-dom/client';
import IntlProviderWrapper from 'hoc/IntlProviderWrapper';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import persistor, { store } from 'store/redux';
import App from 'App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <IntlProviderWrapper>
                    <App />
                </IntlProviderWrapper>
            </LocalizationProvider>
        </PersistGate>
    </Provider>
);
