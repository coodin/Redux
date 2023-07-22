// import {
//   PayloadAction,
//   SerializedError,
//   createAsyncThunk,
//   createEntityAdapter,
//   createSelector,
//   createSlice,
//   nanoid,
// } from "@reduxjs/toolkit"
// import { sub } from "date-fns"
// import { keysForReactionButtonsType } from "./ReactionButtons"
// import { RootState } from "../../app/store"
// import { client } from "../../api/client"
// import { MyPost } from "../../models/Post"

// const postsAdapter = createEntityAdapter<MyPost>({
//   sortComparer: (a, b) => b.date.localeCompare(a.date),
// })

// const initialState = postsAdapter.getInitialState({
//   status: "idle",
//   error: undefined,
// } as { status: string; error?: string })

// // const postState: PostState = {
// //   posts: [],
// //   status: "idle",
// //   error: "",
// // }

// // type PostState = {
// //   posts: MyPost[]
// //   status: "loading" | "succeeded" | "failed" | "idle"
// //   error: string
// // }

// export const fetchPost = createAsyncThunk<MyPost[], void>(
//   "posts/fetchPosts",
//   async () => {
//     const response = await client.get("/fakeApi/posts")
//     return response?.data
//   },
// )

// export const addNewPost = createAsyncThunk(
//   "posts/addNewPost",
//   // The payload creator receives the partial `{title, content, user}` object
//   async (initialPost: { title: string; content: string; user: string }) => {
//     // We send the initial data to the fake API server
//     const response = await client.post("/fakeApi/posts", initialPost)
//     // The response includes the complete post object, including unique ID
//     return response?.data
//   },
// )

// type EditPostPayload = { id: string; title: string; content: string }

// const postsSlice = createSlice({
//   name: "posts",
//   initialState,
//   reducers: {
//     // postAdded: {
//     //   reducer(state, action: PayloadAction<MyPost>) {
//     //     state.posts.push(action.payload)
//     //   },
//     //   prepare(myPostArgs: { title: string; content: string; user: string }) {
//     //     return {
//     //       payload: {
//     //         id: nanoid(),
//     //         date: new Date().toISOString(),
//     //         reactions: { eyes: 0, heart: 0, hooray: 0, rocket: 0, thumbsUp: 0 },
//     //         ...myPostArgs,
//     //       } as MyPost,
//     //     }
//     //   },
//     // },
//     postUpdated(state, action: PayloadAction<EditPostPayload>) {
//       //const updatedPost = state.posts.find((el) => el.id === action.payload.id)
//       const existingPost = state.entities[action.payload.id]
//       if (!existingPost) return
//       existingPost.title = action.payload.title
//       existingPost.content = action.payload.content
//     },
//     reactionAdded(
//       state,
//       action: {
//         type: string
//         payload: { postId: string; reaction: keysForReactionButtonsType }
//       },
//     ) {
//       const { postId, reaction } = action.payload
//       // const existingPost = state.posts.find((post) => post.id === postId)

//       const existingPost = state.entities[postId]
//       if (existingPost) {
//         existingPost.reactions[reaction]++
//       }
//     },
//   },
//   extraReducers(builder) {
//     builder
//       .addCase(fetchPost.pending, (state, action) => {
//         state.status = "loading"
//       })
//       .addCase(fetchPost.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         // Add any fetched posts to the array
//         // Use the `upsertMany` reducer as a mutating update utility
//         postsAdapter.upsertMany(state, action.payload)
//       })
//       .addCase(fetchPost.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.error.message ?? "Something bad happened"
//       })
//       // .addCase(addNewPost.fulfilled, (state, action) => {
//       //   // We can directly add the new post object to our posts array
//       //   //state.posts.push(action.payload)
//       // })
//       .addCase(addNewPost.fulfilled, postsAdapter.addOne)
//   },
// })

// export const { postUpdated, reactionAdded } = postsSlice.actions

// // Export the customized selectors for this adapter using `getSelectors`
// export const {
//   selectAll: selectAllPosts,
//   selectById: selectPostById,
//   selectIds: selectPostIds,
//   // Pass in a selector that returns the posts slice of state
// } = postsAdapter.getSelectors((state: RootState) => state.posts)

// // export const selectAllPosts = (state: RootState) => state.posts.posts
// // export const selectAllPostsAnother = (state: RootState) =>
// //   state.posts.posts.map((post) => post.id)

// // export const selectPostById = (state: RootState, postId: string) =>
// //   state.posts.posts.find((post) => post.id === postId)

// export const selectPostsByUser = createSelector(
//   [selectAllPosts, (state: RootState, userId: string) => userId],
//   (posts, userId) => posts.filter((post) => post.user === userId),
// )

// export default postsSlice.reducer
