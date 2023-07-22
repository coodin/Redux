import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import App from "./App"
import "./index.css"
import { worker } from "./api/server"
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import { SinglePostPage } from "./features/posts/SinglePostPage"
import { EditPostForm } from "./features/posts/EditPostForm"
import Layout from "./Layout"
//import { apiSlice } from "./features/api/apiSlice"
import { extendedApiSlice } from "./features/users/usersSlice"
import { UsersList } from "./features/users/UsersList"
import { UserPage } from "./features/users/UserPage"
import { NotificationsList } from "./features/notification/NotificationsList"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<App />} />
      <Route path="posts/:postId" element={<SinglePostPage />} />
      <Route path="editPost/:postId" element={<EditPostForm />} />
      <Route path="/users" element={<UsersList />} />
      <Route path="/users/:userId" element={<UserPage />} />
      <Route path="/notifications" element={<NotificationsList />} />
    </Route>,
  ),
)

export default Layout

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  // Start our mock API server
  await worker.start({ onUnhandledRequest: "bypass" })
  //store.dispatch(fetchUsers())
  store.dispatch(extendedApiSlice.endpoints.getUsers.initiate())
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router}></RouterProvider>
      </Provider>
    </React.StrictMode>,
  )
}

start()

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <RouterProvider router={router}></RouterProvider>
//     </Provider>
//   </React.StrictMode>,
// )
