import { configureStore } from "@reduxjs/toolkit";
import searchReducer from '../store/searchSlice';
import stocksReducer from '../store/stocksSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store=configureStore({

    reducer:{
        Searchapi : searchReducer,
        Stocksapi: stocksReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export default store