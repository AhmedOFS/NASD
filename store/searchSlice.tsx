import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface searchApiState{
    failure: boolean,
    currentQuery: string,
}




const initialState={
failure: false,
currentQuery: "",
} satisfies searchApiState as searchApiState

const SearchSlice=createSlice({
name: "search",
initialState,
reducers:{
    searchFail(state) {
        state.failure=true
      },
      searchSuccess(state) {
        state.failure=false
      },
      SetQuery(state, action: PayloadAction<{query: string}>) {
        state.currentQuery = action.payload.query
      },

}

})
export default SearchSlice.reducer

export const {searchFail,searchSuccess,SetQuery } = SearchSlice.actions
