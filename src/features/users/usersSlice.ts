import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit"
import { client } from "../../api/client"
import { RootState } from "../../app/store"
import { MyUser } from "../../models/User"
import { apiSlice } from "../api/apiSlice"

const usersAdapter = createEntityAdapter<MyUser>()
const initialState = usersAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<any, void>({
      query: () => "/users",
      transformResponse: (responseData: MyUser[]) => {
        return usersAdapter.setAll(initialState, responseData)
      },
    }),
  }),
})
export const { useGetUsersQuery } = extendedApiSlice
// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters.
// To generate a selector for a specific query argument, call `select(theQueryArg)`.
// In this case, the users query has no params, so we don't pass anything to select()
export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select()

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data,
)

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors(
    (state: RootState) => selectUsersData(state) ?? initialState,
  )
// export const selectAllUsers = createSelector(
//   selectUsersResult,
//   (usersResult) => usersResult?.data ?? emptyUsers,
// )

// export const selectUserById = createSelector(
//   selectAllUsers,
//   (state: RootState, userId: string) => userId,
//   (users: MyUser[], userId: string) => users.find((user) => user.id === userId),
// )

// export const { selectAll: selectAllUsers, selectById: selectUserById } =
//   usersAdapter.getSelectors((state: RootState) => state.users)

// export const selectAllUsers = (state: RootState) => state.users

// export const selectUserById = (state: RootState, userId: string) =>
//   state.users.find((user) => user.id === userId)

//export default usersSlice.reducer
