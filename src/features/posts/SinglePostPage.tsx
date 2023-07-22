import React from "react"
import { useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { RootState } from "../../app/store"
import { PostAuthor } from "./PostAuthor"
import { TimeAgo } from "./TimeAgo"
import { ReactionButtons } from "./ReactionButtons"
import { selectPostById } from "../posts/postsSlice"
import { useGetPostQuery } from "../api/apiSlice"
import { Spinner } from "../../components/Spinner"

export const SinglePostPage = () => {
  //const { postId } = match.params
  const { postId } = useParams()

  const {
    data: post,
    isFetching,
    isSuccess,
    isLoading,
  } = useGetPostQuery(postId ?? "")

  // const post = useSelector((state: RootState) =>
  //   selectPostById(state, postId ?? ""),
  // )
  let content

  if (isFetching) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = (
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
        <PostAuthor userId={post.user ?? ""} />
        <TimeAgo timestamp={post.date} />
        <ReactionButtons post={post} />
      </article>
    )
  }

  return <section>{content}</section>
}
