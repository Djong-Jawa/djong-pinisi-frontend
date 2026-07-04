import { configureStore } from '@reduxjs/toolkit';
import salesPipelineReducer from './features/sales-pipeline/salesPipelineSlice';
import productReducer from './features/product/productSlice';
import tourPackageReducer from './features/tour-package/tourPackageSlice';
import bookingReducer from './features/booking-list/bookingListSlice';
import bookingOperationsReducer from './features/booking-operations/bookingOperationsSlice';
import bookingNowReducer from './features/booking-now/bookingNowSlice';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    salesPipeline: salesPipelineReducer,
    product: productReducer,
    tourPackage: tourPackageReducer,
    booking: bookingReducer,
    bookingOperations: bookingOperationsReducer,
    bookingNow: bookingNowReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;