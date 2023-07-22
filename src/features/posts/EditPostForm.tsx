import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import { postUpdated } from "./postsSlice"
import { RootState } from "../../app/store"
import { selectPostById } from "../posts/postsSlice"
import { useEditPostMutation, useGetPostQuery } from "../api/apiSlice"

export const EditPostForm = () => {
  const { postId } = useParams()
  const navigate = useNavigate()

  // const post = useSelector((state: RootState) =>
  //   selectPostById(state, postId ?? ""),
  // )
  const { data: post } = useGetPostQuery(postId ?? "")
  const [updatePost, { isLoading }] = useEditPostMutation()

  if (!post) {
    return <div>There is no post</div>
  }

  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  //const dispatch = useDispatch()
  // const history = useHistory()

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value)
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value)

  const onSavePostClicked = async () => {
    if (title && content && postId) {
      // dispatch(postUpdated({ id: postId, title, content }))
      await updatePost({ id: postId, content, title })
      navigate(`/posts/${postId}`, { replace: true })
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <button type="button" onClick={onSavePostClicked}>
        Save Post
      </button>
    </section>
  )
}
