import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
// import { postAdded } from "./postsSlice"
import { AppDispatch, RootState } from "../../app/store"
import { addNewPost } from "../posts/postsSlice"
import { selectAllUsers } from "../users/usersSlice"
import { useAppDispatch } from "../../app/hooks"
import { useAddNewPostMutation } from "../api/apiSlice"

export const AddPostForm = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [userId, setUserId] = useState("")
  const [addNewPost, { isLoading }] = useAddNewPostMutation()
  //const [addRequestStatus, setAddRequestStatus] = useState("idle")
  //const dispatch = useAppDispatch()

  // const canSave =
  //   [title, content, userId].every(Boolean) && addRequestStatus === "idle"
  const canSave = [title, content, userId].every(Boolean) && !isLoading

  const users = useSelector(selectAllUsers)

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value)
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value)
  const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value)

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        // setAddRequestStatus("pending")
        // await dispatch(addNewPost({ title, content, user: userId })).unwrap()
        await addNewPost({ content, title, user: userId }).unwrap()
        setTitle("")
        setContent("")
        setUserId("")
      } catch (err) {
        console.error("Failed to save the post: ", err)
      } finally {
        //setAddRequestStatus("idle")
      }
    }
  }

  // const canSave = Boolean(title) && Boolean(content) && Boolean(userId)

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  )
}
