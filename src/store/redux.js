import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import appSlice from './slice/appSlice';
import authSlice from './slice/authSlice';
import bookingDataSlice from './slice/bookingDataSlice';
import chatSlice from './slice/chatSlice';

const persistCommonConfig = {
    storage: storage,
};
const rootPersistConfig = {
    ...persistCommonConfig,
    key: 'root',
};
const appPersistConfig = {
    ...persistCommonConfig,
    key: 'app',
    whitelist: ['language', 'mode'],
};

const authPersistConfig = {
    ...persistCommonConfig,
    key: 'auth',
    whitelist: ['isLoggedIn, userInfo', 'accessToken', 'refreshToken'],
};

const bookingDataPersistConfig = {
    ...persistCommonConfig,
    key: 'bookingData',
    whitelist: ['checkIn', 'checkOut', 'adult', 'child', 'days'],
};

const chatPersistConfig = {
    ...persistCommonConfig,
    key: 'chat',
};

const rootReducer = combineReducers({
    app: persistReducer(appPersistConfig, appSlice),
    auth: persistReducer(authPersistConfig, authSlice),
    chat: persistReducer(chatPersistConfig, chatSlice),
    bookingData: persistReducer(bookingDataPersistConfig, bookingDataSlice),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

const persistor = persistStore(store);

export default persistor;
