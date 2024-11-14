import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Clients from '../apiManagement';
import { RootState } from './store';
export interface stocksApiState{
stocks: Stock[],
next: string,
displayStocks: Stock[]
} 
const initialState={
stocks: [],
displayStocks: [],
next: ""
  } satisfies stocksApiState as stocksApiState


// Async thunk to fetch users from an API
export const fetchStocks = createAsyncThunk('fetchStocks', async () => {
  const response  = await Clients.apiClient.get('/tickers?active=true&limit=12&apiKey=OvTM4lSkLMBfIezG360eiEwaGuUZlJR2');
  const data=await response.data;
  const stocksData: Stock[] =await data.results.map( (item: {ticker: String, name:String}) => {
    const id: String=item.name;
         const symbol =  item.ticker;
         const name=item.name;
         const icon="place"

//         console.log(icon)
 
  const color: String= 'white';
 
 
 
         return {symbol,name, icon} as Stock;
       });

       const next_url=data.next_url
  return {stocksData, next_url};
});
export const fetchSearch = createAsyncThunk('fetchSearch', async (_, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  const query = state.Searchapi.currentQuery;
  const response=await Clients.apiClient.get(`/tickers/${query}` );
//setQuery(input)


 const data = await response.data
      const id: string=data.results.name;
           const symbol =  data.results.ticker;
           const name=data.results.name;
           const icon="place";

          return [{symbol,name, icon}]
   
   
          


});


export const fetchNext = createAsyncThunk('fetchnext', async (_, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  const next = state.Stocksapi.next;
  const response  = await Clients.apiClient.get(next);
  const data=await response.data;
  const stocksData: Stock[] =await data.results.map( (item: {ticker: String, name:String}) => {
    const id: String=item.name;
         const symbol =  item.ticker;
         const name=item.name;
         const icon="place"

//         console.log(icon)
 
  const color: String= 'white';
 
 
 
         return {symbol,name, icon} as Stock;
       });

       const next_url=data.next_url
  return {stocksData, next_url};
});

const stocksSlice = createSlice({
  name: 'stocks',
  initialState: initialState,
  reducers: {
    returnStocks(state) {
      state.displayStocks=state.stocks
    },
    SetDisplay(state, action: PayloadAction<{stock: Stock[]}>) {
      state.displayStocks = action.payload.stock
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
      //  state.status = 'loading';
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
       // state.status = 'succeeded';
        const data= action.payload;
        console.log("data is ", data)
        state.next=data.next_url
     
                state.stocks=data.stocksData;
                state.displayStocks=data.stocksData
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        //state.status = 'failed';
        //state.error = action.error.message;
      })
      .addCase(fetchNext.pending, (state) => {
        //  state.status = 'loading';
        })
        .addCase(fetchNext.fulfilled, (state, action) => {
         // state.status = 'succeeded';
          const data= action.payload;
          console.log("data is ", data)
          state.next=data.next_url 
       
          state.stocks= state.stocks.concat( data.stocksData).filter(
            (item, index, self) => index === self.findIndex((t) => t.name === item.name)
          );;
          state.displayStocks=state.stocks
        })
        .addCase(fetchNext.rejected, (state, action) => {
          //state.status = 'failed';
          //state.error = action.error.message;
        })
        .addCase(fetchSearch.pending, (state) => {
          //  state.status = 'loading';
          })
          .addCase(fetchSearch.fulfilled, (state, action) => {
           // state.status = 'succeeded';
            const data= action.payload;
     
       
         
                
                    state.displayStocks=data;
          
          })
          .addCase(fetchSearch.rejected, (state, action) => {
            //state.status = 'failed';
            //state.error = action.error.message;
          });
  },
});
export const {returnStocks, SetDisplay } = stocksSlice.actions
export default stocksSlice.reducer;