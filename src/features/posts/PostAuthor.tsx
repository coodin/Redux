import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { useEffect } from "react"
import { selectUserById } from "../users/usersSlice"

export const PostAuthor = ({ userId }: { userId: string }) => {
  const author = useSelector((state: RootState) =>
    selectUserById(state, userId),
  )

  return <span>by {author ? author.name : "Unknown author"}</span>
}
