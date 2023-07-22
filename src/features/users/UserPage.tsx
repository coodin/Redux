import React, { useMemo } from "react"
import { useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"

import { selectUserById } from "../users/usersSlice"
import { selectPostsByUser } from "../posts/postsSlice"
import { RootState } from "../../app/store"
import { createSelector } from "@reduxjs/toolkit"
import { useGetPostsQuery } from "../api/apiSlice"
import { MyPost } from "../../models/Post"

export const UserPage = () => {
  const { userId } = useParams()

  const user = useSelector((state: RootState) =>
    selectUserById(state, userId ?? ""),
  )

  const selectPostsForUser = useMemo(() => {
    const emptyArray: MyPost[] = []
    // Return a unique selector instance for this page so that
    // the filtered results are correctly memoized
    return createSelector(
      [(res) => res.data, (res, userId: string) => userId],
      (data: MyPost[] | undefined, userId) =>
        data?.filter((post) => post.user === userId) ?? emptyArray,
    )
  }, [])

  // const postsForUser = useSelector((state: RootState) => {
  //   const allPosts = selectAllPosts(state)
  //   return allPosts.filter((post) => post.user === userId)
  // })
  // const postsForUser = useSelector((state: RootState) =>
  //   selectPostsByUser(state, userId ?? ""),
  // )

  // Use the same posts query, but extract only part of its data
  const { postsForUser } = useGetPostsQuery(undefined, {
    selectFromResult: (result) => ({
      // We can optionally include the other metadata fields from the result here
      ...result,
      // Include a field called `postsForUser` in the hook result object,
      // which will be a filtered list of posts
      postsForUser: selectPostsForUser(result, userId ?? ""),
    }),
  })

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user?.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  )
}
