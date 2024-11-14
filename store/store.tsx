import { configureStore } from "@reduxjs/toolkit";
import searchReducer from './searchSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store=configureStore({

    reducer:{
        Searchapi : searchReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export default store