// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { MyPost } from "../../models/Post"
import { MyUser } from "../../models/User"
import { keysForReactionButtonsType } from "../posts/ReactionButtons"

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "api",
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: "/fakeApi" }),
  tagTypes: ["Post"],
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getPosts: builder.query<MyPost[], void>({
      // The URL for the request is '/fakeApi/posts'
      query: () => "/posts",
      providesTags: (result = [], error, arg) => {
        return [
          ...result.map(({ id }) => ({ type: "Post" as const, id })),
          { type: "Post", id: "LIST" },
        ]

        //if(result == undefined) return;
      },
    }),
    getPost: builder.query<MyPost, string>({
      query: (postId) => `posts/${postId}`,
      providesTags: (result, error, arg) => [{ type: "Post", id: arg }],
    }),
    addNewPost: builder.mutation<
      void,
      Omit<MyPost, "id" | "reactions" | "date">
    >({
      query: (initalPost) => ({
        url: "/posts",
        method: "POST",
        body: initalPost,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    editPost: builder.mutation<void, Pick<MyPost, "id" | "title" | "content">>({
      query: (post) => ({
        url: `/posts/${post.id}`,
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),
    addReaction: builder.mutation({
      query: ({
        postId,
        reaction,
      }: {
        postId: string
        reaction: keysForReactionButtonsType
      }) => ({
        url: `posts/${postId}/reactions`,
        method: "POST",
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reaction },
      }),

      async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
            // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
            const post = draft.find((post) => post.id === postId)
            if (post) {
              post.reactions[reaction]++
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      // invalidatesTags: (result, error, arg) => [
      //   { type: "Post", id: arg.postId },
      // ],
    }),
  }),
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useAddReactionMutation,
  useGetPostsQuery,
  useGetPostQuery,
  useAddNewPostMutation,
  useEditPostMutation,
} = apiSlice
