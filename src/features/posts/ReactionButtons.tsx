import React from "react"

import { useDispatch } from "react-redux"
import { reactionAdded } from "../posts/postsSlice"
import { useAppDispatch } from "../../app/hooks"
import { MyPost } from "../../models/Post"
import { useAddReactionMutation } from "../api/apiSlice"

const reactionEmoji = {
  thumbsUp: "👍",
  hooray: "🎉",
  heart: "❤️",
  rocket: "🚀",
  eyes: "👀",
}

export type keysForReactionButtonsType = keyof typeof reactionEmoji

export const ReactionButtons = ({ post }: { post: MyPost }) => {
  //const dispatch = useAppDispatch()
  const [addReaction] = useAddReactionMutation()
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        onClick={() => {
          addReaction({
            postId: post.id,
            reaction: name as keysForReactionButtonsType,
          })
          // dispatch(
          //   reactionAdded({
          //     postId: post.id ?? "",
          //     reaction: name as keysForReactionButtonsType,
          //   }),
          // )
        }}
        key={name}
        type="button"
        className="muted-button reaction-button"
      >
        {emoji} {post.reactions[name as keysForReactionButtonsType]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
