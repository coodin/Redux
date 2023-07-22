import {
  createSlice,
  createAsyncThunk,
  SliceCaseReducers,
  PayloadAction,
  createEntityAdapter,
  createSelector,
  createAction,
  isAnyOf,
  PrepareAction,
  Dispatch,
} from "@reduxjs/toolkit"

import { client } from "../../api/client"
import { RootState } from "../../app/store"
import { NotificationsList } from "./NotificationsList"
import { apiSlice } from "../api/apiSlice"
import { forceGenerateNotifications } from "../../api/server"

type Notification = {
  id: string
  date: string
  message: string
  user: string
  read: boolean
  isNew: boolean
}

const notificationsReceived = createAction<Notification[]>(
  "notifications/notificationsReceived",
)

// const notificationsAdapter = createEntityAdapter<Notification>({
//   sortComparer: (a, b) => b.date.localeCompare(a.date),
// })

// export const fetchNotifications = createAsyncThunk<
//   Notification[],
//   void,
//   { state: RootState }
// >("notifications/fetchNotifications", async (_, { getState }) => {
//   const allNotifications = getState().notifications
//   const latestNotificationId =
//     allNotifications.ids[allNotifications.ids.length - 1]
//   const latestNotification = allNotifications.entities[latestNotificationId]
//   const latestTimestamp = latestNotification ? latestNotification.date : ""
//   const response = await client.get(
//     `/fakeApi/notifications?since=${latestTimestamp}`,
//   )
//   return response?.data
// })
export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => "/notifications",
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch },
      ) {
        // create a websocket connection when the cache subscription starts
        const ws = new WebSocket("ws://localhost")
        try {
          // wait for the initial query to resolve before proceeding

          await cacheDataLoaded

          // when data is received from the socket connection to the server,
          // update our query result with the received message
          const listener: (this: WebSocket, ev: MessageEvent<any>) => any = (
            event,
          ) => {
            const message: { type: "notifications"; payload: Notification[] } =
              JSON.parse(event.data)
            switch (message.type) {
              case "notifications": {
                updateCachedData((draft: Notification[]) => {
                  // Insert all received notifications from the websocket
                  // into the existing RTKQ cache array
                  draft.push(...message.payload)
                  draft.sort((a, b) => b.date.localeCompare(a.date))
                })
                // Dispatch an additional action so we can track "read" state
                dispatch(notificationsReceived(message.payload))
                break
              }
              default:
                break
            }
          }

          ws.addEventListener("message", listener)
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        ws.close()
      },
    }),
  }),
})

const notificationsAdapter = createEntityAdapter<{
  id: string
  read: boolean
  isNew: boolean
}>()

const matchNotificationsReceived = isAnyOf(
  notificationsReceived,
  extendedApi.endpoints.getNotifications.matchFulfilled,
)

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach((notification) => {
        if (!notification) return
        notification.read = true
      })
      // state.forEach((notification) => {
      //   notification.read = true
      // })
    },
  },
  extraReducers(builder) {
    builder.addMatcher(matchNotificationsReceived, (state, action) => {
      // Add client-side metadata for tracking new notifications
      const notificationsMetadata = action.payload.map((notification) => ({
        id: notification.id,
        read: false,
        isNew: true,
      }))

      Object.values(state.entities).forEach((notification) => {
        if (!notification) return
        // Any notifications we've read are no longer new

        notification.isNew = !notification.read
      })

      notificationsAdapter.upsertMany(state, notificationsMetadata)
    })
    // builder.addCase(fetchNotifications.fulfilled, (state, action) => {
    //   notificationsAdapter.upsertMany(state, action.payload)
    //   Object.values(state.entities).forEach((notification) => {
    //     // Any notifications we've read are no longer new
    //     if (!notification) return
    //     notification.isNew = !notification.read
    //   })
    // state.push(...action.payload)
    // state.forEach((notification) => {
    //   // Any notifications we've read are no longer new
    //   //        console.log(`Action param ${notification.isNew}`)

    //   notification.isNew = !notification.read
    // })
    // // Sort with newest first
    // state.sort((a, b) => b.date.localeCompare(a.date))
  },
})

// export const { allNotificationsRead } = notificationsSlice.actions

// export default notificationsSlice.reducer

// export const { selectAll: selectAllNotifications } =
//   notificationsAdapter.getSelectors((state: RootState) => state.notifications)
//export const selectAllNotifications = (state: RootState) => state.notifications

export const { useGetNotificationsQuery } = extendedApi

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const {
  selectAll: selectNotificationsMetadata,
  selectEntities: selectMetadataEntities,
} = notificationsAdapter.getSelectors((state: RootState) => state.notifications)

const emptyNotifications: Notification[] = []

export const selectNotificationsResult =
  extendedApi.endpoints.getNotifications.select()

const selectNotificationsData = createSelector(
  selectNotificationsResult,
  (notificationsResult) => notificationsResult.data ?? emptyNotifications,
)

export const fetchNotificationsWebsocket =
  () => (dispatch: Dispatch, getState: any) => {
    const allNotifications = selectNotificationsData(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification?.date ?? ""
    // Hardcode a call to the mock server to simulate a server push scenario over websockets
    forceGenerateNotifications(latestTimestamp)
  }
