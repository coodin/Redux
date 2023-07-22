import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
//import postsReducer from "../features/posts/postsSlice"
//import usersReducer from "../features/users/usersSlice"
import notificationReducer from "../features/notification/notificationsSlice"
import { apiSlice } from "../features/api/apiSlice"

export const store = configureStore({
  reducer: {
    //posts: postsReducer,
    //users: usersReducer,
    notifications: notificationReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
// import {
//   AsyncThunk,
//   AsyncThunkPayloadCreator,
//   Dispatch,
// } from "@reduxjs/toolkit"

// declare module "@reduxjs/toolkit" {
//   type AsyncThunkConfig = {
//     state?: unknown
//     dispatch?: Dispatch
//     extra?: unknown
//     rejectValue?: unknown
//     serializedErrorType?: unknown
//   }

//   function createAsyncThunk<
//     Returned,
//     ThunkArg = void,
//     ThunkApiConfig extends AsyncThunkConfig = {
//       state: RootState // this line makes a difference
//     },
//   >(
//     typePrefix: string,
//     payloadCreator: AsyncThunkPayloadCreator<
//       Returned,
//       ThunkArg,
//       ThunkApiConfig
//     >,
//     options?: any,
//   ): AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
// }
